"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import {
  CHANNEL_LABELS,
  LANGUAGE_LABELS,
  PRIORITY_LABELS,
  TYPE_LABELS,
  expiryLabel,
  timeZoneLabel,
} from "@/features/notifications/preferences";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const PLAN_LABEL: Record<string, string> = {
  "1m": "Starter",
  "2m": "Growth",
  "3m": "Pro",
};

function Group({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof SendOutlinedIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-4 first:mt-0">
      <h3 className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-(--color-text-hint)">
        <Icon sx={{ fontSize: 13 }} />
        {title}
      </h3>
      <div className="mt-1">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-(--color-border-default) last:border-b-0">
      <span className="text-[11.5px] text-(--color-text-secondary) shrink-0">{label}</span>
      <span className="text-[11.5px] font-medium text-(--color-text-primary) text-right break-words">
        {value}
      </span>
    </div>
  );
}

interface Props {
  planType?: string;
  dailyLimit?: number;
}

/**
 * The defaults every scheduled send inherits.
 *
 * Read-only on purpose: Preferences already owns these settings and saves them
 * as you type, so duplicating the controls here would give two places to
 * change one value — but the whole set is worth seeing before you schedule.
 */
export default function PreferencesRail({ planType, dailyLimit }: Props) {
  const router = useRouter();
  const { values, loaded } = useNotificationPreferences();
  const show = (value: string) => (loaded ? value : "—");

  return (
    <aside className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">Your defaults</h2>
          <p className="text-[11px] text-(--color-text-hint) mt-0.5">
            Applied to everything you schedule.
          </p>
        </div>
        <span className="w-8 h-8 shrink-0 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
          <TuneOutlinedIcon sx={{ fontSize: 16 }} />
        </span>
      </header>

      {dailyLimit !== undefined && (
        <Group icon={EventAvailableOutlinedIcon} title="Plan">
          <Row
            label="Daily limit"
            value={`${dailyLimit} per day${planType ? ` · ${PLAN_LABEL[planType] ?? planType}` : ""}`}
          />
        </Group>
      )}

      <Group icon={SendOutlinedIcon} title="Sending">
        <Row label="Type" value={show(TYPE_LABELS[values.defaultType] ?? values.defaultType)} />
        <Row
          label="Priority"
          value={show(PRIORITY_LABELS[values.defaultPriority] ?? values.defaultPriority)}
        />
        <Row
          label="Channels"
          value={show(values.channels.map((c) => CHANNEL_LABELS[c] ?? c).join(", "))}
        />
        <Row label="Expires after" value={show(expiryLabel(values.expiryHours))} />
      </Group>

      <Group icon={ScheduleOutlinedIcon} title="Timing">
        <Row label="Time zone" value={show(timeZoneLabel(values.timeZone))} />
        <Row
          label="Default schedule"
          value={show(values.scheduleType === "NOW" ? "Send now" : "Schedule")}
        />
        <Row
          label="Weekend sending"
          value={show(values.weekendSending ? "Allowed" : "Paused")}
        />
        <Row label="Quiet hours" value={show(`${values.quietFrom} – ${values.quietTo}`)} />
      </Group>

      <Group icon={PaletteOutlinedIcon} title="Content">
        <Row
          label="Language"
          value={show(LANGUAGE_LABELS[values.language] ?? values.language)}
        />
        <Row label="Format" value={show(values.defaultFormat === "BANNER" ? "Banner" : "Expanded")} />
        <Row label="App logo" value={show(values.showAppLogo ? "Shown" : "Hidden")} />
        <Row label="Timestamp" value={show(values.showTimestamp ? "Shown" : "Hidden")} />
      </Group>

      <Group icon={ShieldOutlinedIcon} title="Safety">
        <Row
          label="Confirm before sending"
          value={show(values.confirmBeforeSending ? "On" : "Off")}
        />
        <Row
          label="Retry failed"
          value={show(values.retryFailed ? `Up to ${values.maxRetries} times` : "Off")}
        />
        <Row label="Analytics" value={show(values.analyticsTracking ? "Tracked" : "Off")} />
      </Group>

      <p className="mt-4 text-[10.5px] leading-relaxed text-(--color-text-hint)">
        Quiet hours pause instant sends. A schedule runs at the exact time you pick.
      </p>

      <button
        type="button"
        onClick={() => router.push("/shopkeeper/notifications/preferences")}
        className="mt-3 w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-(--color-brand-primary-light) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-muted) transition-colors cursor-pointer"
      >
        Edit preferences
        <ArrowForwardOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
    </aside>
  );
}
