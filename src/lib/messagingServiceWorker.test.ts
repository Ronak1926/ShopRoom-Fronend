import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vm from "node:vm";
import { parseTapHash } from "../features/push/tapLink.ts";
import { buildServiceWorkerSource } from "./messagingServiceWorker.ts";

const ORIGIN = "https://shoproom.example";
const API = "https://api.shoproom.example";
const TOKEN = "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b";

type Listener = (event: unknown) => void;

/** Runs the generated service-worker script against a stand-in for the browser's worker environment. */
function loadWorker(options: { openClients?: { url: string }[] } = {}) {
  const listeners: Record<string, Listener> = {};
  const shown: { title: string; options: Record<string, unknown> }[] = [];
  const fetches: { url: string; body: unknown }[] = [];
  const opened: string[] = [];
  const navigated: string[] = [];
  const focused: string[] = [];
  let backgroundHandler: (payload: unknown) => unknown = () => undefined;

  const clients = (options.openClients ?? []).map((c) => ({
    url: c.url,
    focus: async () => void focused.push(c.url),
    navigate: async (target: string) => void navigated.push(target),
  }));

  const sandbox = {
    importScripts: () => undefined,
    firebase: {
      initializeApp: () => undefined,
      messaging: () => ({ onBackgroundMessage: (handler: typeof backgroundHandler) => (backgroundHandler = handler) }),
    },
    fetch: async (url: string, init: { body: string }) => {
      fetches.push({ url, body: JSON.parse(init.body) });
      return { ok: true };
    },
    URL,
    self: {
      location: { origin: ORIGIN },
      registration: { showNotification: async (title: string, opts: Record<string, unknown>) => void shown.push({ title, options: opts }) },
      clients: {
        matchAll: async () => clients,
        openWindow: async (target: string) => void opened.push(target),
      },
      addEventListener: (name: string, listener: Listener) => void (listeners[name] = listener),
    },
  };
  vm.runInNewContext(
    buildServiceWorkerSource({ apiKey: "k", authDomain: "a", projectId: "p", messagingSenderId: "1", appId: "x" }, API),
    sandbox,
  );

  return {
    shown,
    fetches,
    opened,
    navigated,
    focused,
    receive: (data: Record<string, string>) => backgroundHandler({ data }),
    async tap(data: Record<string, string> | undefined) {
      let closed = false;
      let pending: Promise<unknown> = Promise.resolve();
      listeners.notificationclick({
        notification: { data, close: () => void (closed = true) },
        waitUntil: (promise: Promise<unknown>) => void (pending = promise),
      });
      await pending;
      return { closed };
    },
  };
}

const PUSH = { sendId: "send_abc123", roomId: "room_xyz", rt: TOKEN, title: "Sunrise Textiles", body: "Flash sale" };

describe("service worker: showing a push", () => {
  it("shows the title, text and hero image, and reports DELIVERED", async () => {
    const worker = loadWorker();
    await worker.receive({ ...PUSH, imageUrl: "https://res.cloudinary.com/demo/image/upload/hero.jpg" });
    assert.equal(worker.shown.length, 1);
    assert.equal(worker.shown[0].title, "Sunrise Textiles");
    assert.equal(worker.shown[0].options.body, "Flash sale");
    assert.equal(worker.shown[0].options.image, "https://res.cloudinary.com/demo/image/upload/hero.jpg");
    assert.deepEqual(worker.fetches, [{ url: `${API}/api/notifications/receipts`, body: { token: TOKEN, event: "DELIVERED" } }]);
  });
});

describe("service worker: tapping a notification", () => {
  it("opens the room with a fragment that tells the page which push to replay", async () => {
    const worker = loadWorker();
    const { closed } = await worker.tap(PUSH);
    assert.equal(closed, true);
    assert.deepEqual(worker.opened, [`/customer/room/room_xyz#push=send_abc123:${TOKEN}`]);
    assert.deepEqual(worker.fetches.map((f) => f.body), [{ token: TOKEN, event: "OPENED" }]);
  });

  it("keeps the receipt token out of the query string, which servers log", async () => {
    const worker = loadWorker();
    await worker.tap(PUSH);
    assert.ok(!worker.opened[0].includes("?"), "no query string");
    assert.ok(worker.opened[0].indexOf(TOKEN) > worker.opened[0].indexOf("#"), "token is inside the fragment");
  });

  it("builds exactly what the page's parser reads", async () => {
    const worker = loadWorker();
    await worker.tap(PUSH);
    const fragment = worker.opened[0].slice(worker.opened[0].indexOf("#"));
    assert.deepEqual(parseTapHash(fragment), { sendId: "send_abc123", receiptToken: TOKEN });
  });

  it("reuses an open ShopRoom tab: focuses it and points it at the same fragment", async () => {
    const worker = loadWorker({ openClients: [{ url: `${ORIGIN}/customer/home` }] });
    await worker.tap(PUSH);
    assert.deepEqual(worker.focused, [`${ORIGIN}/customer/home`]);
    assert.deepEqual(worker.navigated, [`/customer/room/room_xyz#push=send_abc123:${TOKEN}`]);
    assert.deepEqual(worker.opened, [], "no second window");
  });

  it("ignores open tabs from other sites", async () => {
    const worker = loadWorker({ openClients: [{ url: "https://elsewhere.example/page" }] });
    await worker.tap(PUSH);
    assert.equal(worker.opened.length, 1);
    assert.deepEqual(worker.navigated, []);
  });

  it("opens the room without a fragment when the push carries no send reference", async () => {
    const worker = loadWorker();
    await worker.tap({ roomId: "room_xyz" });
    assert.deepEqual(worker.opened, ["/customer/room/room_xyz"]);
    assert.deepEqual(worker.fetches, [], "no token, so nothing to report");
  });

  it("falls back to the home page when there is no room", async () => {
    const worker = loadWorker();
    await worker.tap({});
    assert.deepEqual(worker.opened, ["/customer/home"]);
    await worker.tap(undefined);
    assert.deepEqual(worker.opened, ["/customer/home", "/customer/home"]);
  });

  it("never puts unvalidated values from the payload into the link", async () => {
    const worker = loadWorker();
    await worker.tap({ roomId: "room_xyz", sendId: "../../admin", rt: "not-a-uuid" });
    assert.deepEqual(worker.opened, ["/customer/room/room_xyz"]);

    const second = loadWorker();
    await second.tap({ roomId: "room_xyz", sendId: "send_abc123", rt: "<script>alert(1)</script>" });
    assert.deepEqual(second.opened, ["/customer/room/room_xyz#push=send_abc123"]);

    const third = loadWorker();
    await third.tap({ roomId: "a/b?x=1#y" });
    assert.deepEqual(third.opened, ["/customer/room/a%2Fb%3Fx%3D1%23y"], "room ids are encoded, not trusted");
  });
});
