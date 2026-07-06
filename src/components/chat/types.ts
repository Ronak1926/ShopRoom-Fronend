/** Which pane of the room page is showing — tabs swap the main content
 * area in place, no navigation involved. Sharing isn't its own pane — it's
 * a button inside Room Info that opens the site's common ShareModal. */
export type ChatTab = "chat" | "info" | "members";

/** Shared room-details shape — both the customer room page and the
 * shopkeeper room page fetch this from the same `GET /api/rooms/:roomId`
 * endpoint, so the two chat views render from identical data. */
export interface RoomDetails {
  roomId: string;
  shopName: string;
  logoUrl: string | null;
  category: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  membersCount: number;
  inviteCode: string;
  createdAt: string;
}
