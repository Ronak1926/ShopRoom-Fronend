import { toCsv } from "../../lib/csv.ts";

export interface ExportableMember {
  customerName: string;
  joinedAt: string;
  notificationsEnabled: boolean;
}

/** The members list as CSV. Emails are left out on purpose: the file is easy to share and keep. */
export function membersToCsv(members: ExportableMember[]): string {
  return toCsv([
    ["Name", "Joined", "Notifications"],
    ...members.map((m) => [m.customerName, m.joinedAt.slice(0, 10), m.notificationsEnabled ? "On" : "Off"]),
  ]);
}
