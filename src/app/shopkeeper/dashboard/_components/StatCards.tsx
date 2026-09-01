"use client";

import type { ElementType } from "react";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import SampleBadge from "./SampleBadge";
import { NEARBY_RADIUS_KM, type DashboardSnapshot } from "../_hooks/useDashboardData";
import type { NotificationMetrics } from "../_data/sampleMetrics";

function Delta({ value, windowLabel }: { value: number; windowLabel: string }) {
  if (!value) {
    return <p className="mt-1.5 text-[11px] text-(--color-text-hint)">No change {windowLabel}</p>;
  }
  const up = value > 0;
  return (
    <p
      className={`mt-1.5 flex items-center gap-0.5 text-[11px] font-semibold ${
        up ? "text-(--color-success)" : "text-(--color-danger)"
      }`}
    >
      {up ? (
        <ArrowUpwardOutlinedIcon sx={{ fontSize: 12 }} />
      ) : (
        <ArrowDownwardOutlinedIcon sx={{ fontSize: 12 }} />
      )}
      {Math.abs(value)}%
      <span className="font-normal text-(--color-text-hint)"> {windowLabel}</span>
    </p>
  );
}

function Card({
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
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-4">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 shrink-0 rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
          <Icon sx={{ fontSize: 19 }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11.5px] text-(--color-text-secondary) truncate">{label}</p>
            {sample && <SampleBadge />}
          </div>
          <p className="mt-0.5 text-[22px] font-bold leading-tight text-(--color-text-primary) tabular-nums">
            {value}
          </p>
          {children}
        </div>
      </div>
    </article>
  );
}

interface Props {
  data: DashboardSnapshot;
  metrics: NotificationMetrics;
  memberDelta: number;
  windowLabel: string;
}

export default function StatCards({ data, metrics, memberDelta, windowLabel }: Props) {
  const nearbyShare = data.membersTotal
    ? Math.round((data.audience.nearby / data.membersTotal) * 1000) / 10
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      <Card
        icon={PeopleOutlinedIcon}
        label="Total Room Members"
        value={data.membersTotal.toLocaleString()}
      >
        <Delta value={memberDelta} windowLabel={windowLabel} />
      </Card>

      <Card
        icon={PlaceOutlinedIcon}
        label={`People within ${NEARBY_RADIUS_KM} km`}
        value={data.audience.nearby.toLocaleString()}
      >
        <p className="mt-1.5 text-[11px] text-(--color-text-hint)">
          {data.hasCoordinates
            ? `${nearbyShare}% of your members`
            : "Set your shop location to measure"}
        </p>
      </Card>

      <Card
        icon={SendOutlinedIcon}
        label="Total Notifications Sent"
        value={metrics.totals.sent.toLocaleString()}
        sample
      >
        <Delta value={metrics.deltas.sent} windowLabel={windowLabel} />
      </Card>

      <Card
        icon={MarkEmailReadOutlinedIcon}
        label="Delivered"
        value={metrics.totals.delivered.toLocaleString()}
        sample
      >
        <p className="mt-1.5 text-[11px] text-(--color-text-hint)">
          {metrics.rates.delivery}% delivery rate
        </p>
      </Card>

      <Card
        icon={VisibilityOutlinedIcon}
        label="Opened"
        value={metrics.totals.opened.toLocaleString()}
        sample
      >
        <p className="mt-1.5 text-[11px] text-(--color-text-hint)">
          {metrics.rates.open}% open rate
        </p>
      </Card>

      <Card
        icon={AdsClickOutlinedIcon}
        label="Clicked"
        value={metrics.totals.clicked.toLocaleString()}
        sample
      >
        <p className="mt-1.5 text-[11px] text-(--color-text-hint)">
          {metrics.rates.click}% click rate
        </p>
      </Card>
    </div>
  );
}
