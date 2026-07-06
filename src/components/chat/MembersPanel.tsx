"use client";

import { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Avatar from "@/components/ui/Avatar";
import StatusDot from "@/components/ui/StatusDot";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import type { Role } from "@/lib/socket";

interface Member {
  customerId: string;
  customerName: string;
  joinedAt: string;
  distanceKm: number | null;
}

interface MembersPanelProps {
  roomId: string;
  role: Role;
  onlineCustomerIds: string[];
}

const COOKIE_BY_ROLE: Record<Role, string> = {
  customer: "token",
  shopkeeper: "shopkeeper_token",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Two-pane Members view — list on the left (searchable), full detail on the
 * right — the room page's full width makes this a nicer fit than a
 * click-through single-column modal.
 */
export default function MembersPanel({ roomId, role, onlineCustomerIds }: MembersPanelProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie(COOKIE_BY_ROLE[role]);
    if (!token) return;
    setAuthToken(token);
    apiClient
      .get<{ members: Member[] }>(`/api/rooms/${roomId}/members`)
      .then((res) => {
        setMembers(res.data.members);
        setSelectedId((prev) => prev ?? res.data.members[0]?.customerId ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId, role]);

  const onlineIds = new Set(onlineCustomerIds);
  const filtered = members.filter((m) =>
    m.customerName.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = members.find((m) => m.customerId === selectedId) ?? null;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* List */}
      <aside className="w-80 min-w-80 bg-(--color-bg-surface) border-r border-(--color-border-default) flex flex-col">
        <div className="px-4 pt-4 pb-3 shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-hint) mb-2.5">
            Members — {members.length}
          </p>
          <div className="relative">
            <SearchOutlinedIcon
              sx={{ fontSize: 16, color: "var(--color-text-secondary)" }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full h-9 bg-(--color-bg-page) border border-(--color-border-default) rounded-lg pl-8 pr-3 text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) outline-none focus:border-(--color-brand-primary) transition-colors"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="text-sm text-(--color-text-hint) py-8 text-center">
              Loading members...
            </div>
          )}
          {!loading &&
            filtered.map((m) => (
              <button
                key={m.customerId}
                onClick={() => setSelectedId(m.customerId)}
                className={`flex items-center gap-3 w-full px-4 h-14 text-left cursor-pointer border-0 transition-colors ${
                  selectedId === m.customerId
                    ? "bg-(--color-brand-primary-light)"
                    : "bg-transparent hover:bg-(--color-bg-page)"
                }`}
              >
                <Avatar
                  name={m.customerName}
                  size="sm"
                  status={onlineIds.has(m.customerId) ? "online" : "offline"}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-(--color-text-primary) truncate">
                    {m.customerName}
                  </div>
                  <div className="text-[11px] text-(--color-text-hint)">
                    {onlineIds.has(m.customerId) ? "Active now" : "Offline"}
                  </div>
                </div>
              </button>
            ))}
          {!loading && filtered.length === 0 && (
            <div className="text-sm text-(--color-text-hint) py-8 text-center">
              No members found.
            </div>
          )}
        </div>
      </aside>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto bg-(--color-bg-page)">
        {selected ? (
          <div className="max-w-lg mx-auto px-6 py-10">
            <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-8 flex flex-col items-center text-center gap-3 mb-6">
              <Avatar
                name={selected.customerName}
                size="xl"
                status={onlineIds.has(selected.customerId) ? "online" : "offline"}
              />
              <h2 className="text-xl font-bold text-(--color-text-primary)">
                {selected.customerName}
              </h2>
              <div className="flex items-center gap-1.5">
                <StatusDot status={onlineIds.has(selected.customerId) ? "online" : "offline"} size={7} />
                <span className="text-[13px] text-(--color-text-secondary)">
                  {onlineIds.has(selected.customerId) ? "Active now" : "Offline"}
                </span>
              </div>
            </div>

            <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
                  <NearMeOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
                </div>
                <div>
                  <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
                    Distance from shop
                  </p>
                  <p className="text-[14px] font-medium text-(--color-text-primary)">
                    {selected.distanceKm !== null ? `${selected.distanceKm} km away` : "Not shared"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "var(--color-brand-primary)" }} />
                </div>
                <div>
                  <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
                    Joined room
                  </p>
                  <p className="text-[14px] font-medium text-(--color-text-primary)">
                    {formatDate(selected.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
                  <PeopleOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
                </div>
                <div>
                  <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">Status</p>
                  <p className="text-[14px] font-medium text-(--color-text-primary)">
                    {onlineIds.has(selected.customerId) ? "Online now" : "Currently offline"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-(--color-text-hint)">
            Select a member to see their details.
          </div>
        )}
      </div>
    </div>
  );
}
