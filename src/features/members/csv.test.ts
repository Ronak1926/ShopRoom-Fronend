import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { membersToCsv } from "./csv.ts";

describe("membersToCsv", () => {
  it("writes a header and one row per member, without emails", () => {
    const csv = membersToCsv([
      { customerName: "Asha Rao", joinedAt: "2026-10-30T08:15:00.000Z", notificationsEnabled: true },
      { customerName: "=cmd", joinedAt: "2026-01-02T00:00:00.000Z", notificationsEnabled: false },
    ]);
    assert.equal(csv, "Name,Joined,Notifications\r\nAsha Rao,2026-10-30,On\r\n'=cmd,2026-01-02,Off\r\n");
    assert.ok(!csv.includes("@"));
  });

  it("is just the header for an empty list", () => {
    assert.equal(membersToCsv([]), "Name,Joined,Notifications\r\n");
  });
});
