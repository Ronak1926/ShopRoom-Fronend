import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultRoute, resolveActionRoute } from "./actionRouter.ts";

const ROOM = "room_abc123";

describe("resolveActionRoute", () => {
  it("opens the room the push came from by default", () => {
    assert.deepEqual(resolveActionRoute({ type: "OPEN_ROOM" }, ROOM), { kind: "internal", path: `/customer/room/${ROOM}` });
    assert.deepEqual(resolveActionRoute({ type: "OPEN_CHAT" }, ROOM), { kind: "internal", path: `/customer/room/${ROOM}` });
    assert.deepEqual(defaultRoute(ROOM), { kind: "internal", path: `/customer/room/${ROOM}` });
  });

  it("honours a well-formed room id in the target", () => {
    assert.deepEqual(resolveActionRoute({ type: "OPEN_ROOM", target: "other-room_1" }, ROOM), {
      kind: "internal",
      path: "/customer/room/other-room_1",
    });
  });

  it("ignores a target that is not an id, so a design cannot inject a path", () => {
    for (const target of ["../../admin", "a/b", "room?x=1", "<script>", "x".repeat(65), "", "a b"]) {
      assert.deepEqual(
        resolveActionRoute({ type: "OPEN_ROOM", target }, ROOM),
        { kind: "internal", path: `/customer/room/${ROOM}` },
        JSON.stringify(target),
      );
    }
  });

  it("sends product and collection actions to the shop's room until those pages exist", () => {
    for (const type of ["OPEN_PRODUCT", "OPEN_COLLECTION"]) {
      assert.deepEqual(resolveActionRoute({ type, target: "anything" }, ROOM), { kind: "internal", path: `/customer/room/${ROOM}` });
    }
  });

  it("sends JOIN_ROOM to the home page", () => {
    assert.deepEqual(resolveActionRoute({ type: "JOIN_ROOM" }, ROOM), { kind: "internal", path: "/customer/home" });
  });

  it("opens http and https links externally", () => {
    assert.deepEqual(resolveActionRoute({ type: "OPEN_URL", url: "https://shop.example.com/offers?x=1" }, ROOM), {
      kind: "external",
      url: "https://shop.example.com/offers?x=1",
    });
    assert.equal(resolveActionRoute({ type: "OPEN_URL", url: "http://shop.example.com" }, ROOM)?.kind, "external");
  });

  it("refuses every other kind of link", () => {
    for (const url of [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
      "intent://x#Intent;end",
      "ftp://shop.example.com",
      "not a url",
      "",
      undefined,
    ]) {
      assert.equal(resolveActionRoute({ type: "OPEN_URL", url }, ROOM), null, String(url));
    }
  });

  it("does nothing for unknown or inert actions", () => {
    assert.equal(resolveActionRoute({ type: "NONE" }, ROOM), null);
    assert.equal(resolveActionRoute({ type: "SOMETHING_NEW" }, ROOM), null);
  });
});
