/**
 * features/members/api.ts — The members of the shopkeeper's room.
 * Every call is shopkeeper-authenticated (token from the shopkeeper cookie).
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export interface MemberRow {
  id: string;
  customerName: string;
  email: string;
  joinedAt: string;
  notificationsEnabled: boolean;
}

export interface MembersFilter {
  q?: string;
  notifications?: "on" | "off";
}

export interface MembersPage {
  members: MemberRow[];
  total: number;
  totalPages: number;
}

const EXPORT_PAGE_SIZE = 100;
/** A hard stop so an export can never turn into an endless loop of requests. */
const EXPORT_MAX_PAGES = 100;

export async function fetchMembers(page: number, limit: number, filter: MembersFilter = {}): Promise<MembersPage> {
  const { data } = await apiClient.get<MembersPage>("/api/shop/members", {
    params: { page, limit, ...(filter.q ? { q: filter.q } : {}), ...(filter.notifications ? { notifications: filter.notifications } : {}) },
    headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}`, "Cache-Control": "no-cache" },
  });
  return data;
}

/** Every member matching the filter, fetched a page at a time. */
export async function fetchAllMembers(filter: MembersFilter = {}): Promise<MemberRow[]> {
  const all: MemberRow[] = [];
  for (let page = 0; page < EXPORT_MAX_PAGES; page += 1) {
    const result = await fetchMembers(page, EXPORT_PAGE_SIZE, filter);
    all.push(...result.members);
    if (page + 1 >= result.totalPages) break;
  }
  return all;
}
