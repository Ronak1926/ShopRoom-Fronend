"use client";

import { useEffect, useState } from "react";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { describeSecurityEvent } from "@/features/account/describeSecurityEvent";
import { fetchSecurityEvents, type SecurityEvent } from "@/features/account/securityEvents";

interface Props {
  /** Cookie holding this role's session token. */
  cookieName: "token" | "shopkeeper_token";
  /** GET endpoint for this role. */
  endpoint: string;
}

const WHEN = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-9 animate-pulse rounded bg-(--color-bg-surface-hover)" />
      ))}
    </div>
  );
}

export default function RecentActivityCard({ cookieName, endpoint }: Props) {
  const [events, setEvents] = useState<SecurityEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSecurityEvents(endpoint, cookieName)
      .then((rows) => !cancelled && setEvents(rows))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [cookieName, endpoint]);

  return (
    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2 mb-1">
        <HistoryOutlinedIcon sx={{ fontSize: 20 }} className="text-(--color-brand-primary)" />
        <h2 className="text-base font-semibold text-(--color-text-primary)">Recent activity</h2>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-4">
        Sign-ins and account changes. If something here wasn&apos;t you, change your password and sign out of all devices.
      </p>
      {failed ? (
        <p role="alert" className="text-sm text-(--color-danger-text)">
          Couldn&apos;t load your recent activity.
        </p>
      ) : events === null ? (
        <ActivitySkeleton />
      ) : events.length === 0 ? (
        <p className="text-sm text-(--color-text-secondary)">Nothing recorded yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-(--color-border-default)">
          {events.map((event) => {
            const { label, warning } = describeSecurityEvent(event);
            return (
              <li key={event.id} className="flex items-start gap-3 py-2.5">
                {warning ? <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} className="mt-0.5 shrink-0 text-(--color-danger)" /> : <span className="w-[18px] shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] font-medium ${warning ? "text-(--color-danger-text)" : "text-(--color-text-primary)"}`}>{label}</p>
                  <p className="text-[12px] text-(--color-text-secondary)">
                    {event.device}
                    {event.ip ? ` · ${event.ip}` : ""}
                  </p>
                </div>
                <time dateTime={event.at} className="shrink-0 text-[12px] text-(--color-text-secondary)">
                  {WHEN.format(new Date(event.at))}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
