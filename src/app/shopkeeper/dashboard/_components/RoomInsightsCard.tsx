"use client";

import type { ElementType, ReactNode } from "react";
import { useRouter } from "next/navigation";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import SampleBadge from "./SampleBadge";

function Insight({
  icon: Icon,
  label,
  value,
  sample,
  children,
}: {
  icon: ElementType;
  label: string;
  value: string;
  sample?: boolean;
  children: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-(--color-border-default) p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="w-8 h-8 shrink-0 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
          <Icon sx={{ fontSize: 16 }} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] text-(--color-text-secondary) truncate">{label}</p>
            {sample && <SampleBadge />}
          </div>
          <p className="mt-0.5 text-[19px] font-bold leading-tight text-(--color-text-primary) tabular-nums">
            {value}
          </p>
          {children}
        </div>
      </div>
    </article>
  );
}

interface Props {
  membersTotal: number;
  newMembers: number;
  newMembersDelta: number;
  activeMembers: number;
  returningMembers: number;
  engagementScore: number;
  windowLabel: string;
}

export default function RoomInsightsCard({
  membersTotal,
  newMembers,
  newMembersDelta,
  activeMembers,
  returningMembers,
  engagementScore,
  windowLabel,
}: Props) {
  const router = useRouter();
  const share = (value: number) =>
    membersTotal ? `${Math.round((value / membersTotal) * 1000) / 10}% of total` : "—";

  const grade =
    engagementScore >= 75 ? "Great" : engagementScore >= 55 ? "Good" : "Needs work";

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <h2 className="text-[14px] font-bold text-(--color-text-primary)">Room Insights</h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Insight
          icon={PeopleOutlinedIcon}
          label="Active Members"
          value={activeMembers.toLocaleString()}
          sample
        >
          <p className="mt-1 text-[10.5px] text-(--color-text-hint)">{share(activeMembers)}</p>
        </Insight>

        <Insight
          icon={PersonAddAltOutlinedIcon}
          label="New Members"
          value={newMembers.toLocaleString()}
        >
          {newMembersDelta ? (
            <p
              className={`mt-1 flex items-center gap-0.5 text-[10.5px] font-semibold ${
                newMembersDelta > 0 ? "text-(--color-success)" : "text-(--color-danger)"
              }`}
            >
              <ArrowUpwardOutlinedIcon
                sx={{ fontSize: 11 }}
                className={newMembersDelta > 0 ? "" : "rotate-180"}
              />
              {Math.abs(newMembersDelta)}%
              <span className="font-normal text-(--color-text-hint)"> {windowLabel}</span>
            </p>
          ) : (
            <p className="mt-1 text-[10.5px] text-(--color-text-hint)">{windowLabel}</p>
          )}
        </Insight>

        <Insight
          icon={AutorenewOutlinedIcon}
          label="Returning Members"
          value={returningMembers.toLocaleString()}
          sample
        >
          <p className="mt-1 text-[10.5px] text-(--color-text-hint)">
            {activeMembers
              ? `${Math.round((returningMembers / activeMembers) * 1000) / 10}% of active`
              : "—"}
          </p>
        </Insight>

        <Insight
          icon={TrendingUpOutlinedIcon}
          label="Engagement Score"
          value={String(engagementScore)}
          sample
        >
          <span className="mt-1 inline-flex h-5 px-2 rounded-full bg-(--color-success-light) text-[10px] font-semibold text-(--color-success-text) items-center">
            {grade}
          </span>
        </Insight>
      </div>

      <button
        type="button"
        onClick={() => router.push("/shopkeeper/notifications/history")}
        className="mt-4 w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-(--color-brand-primary-light) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-muted) transition-colors cursor-pointer"
      >
        View full insights
        <ArrowForwardOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
    </section>
  );
}
