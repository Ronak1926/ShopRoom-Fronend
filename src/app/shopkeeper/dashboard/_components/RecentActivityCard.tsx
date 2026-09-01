"use client";

import { useRouter } from "next/navigation";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import SampleBadge from "./SampleBadge";
import type { SendRow } from "../_data/sampleMetrics";

const STATUS_STYLE: Record<string, string> = {
  Delivered: "bg-(--color-success-light) text-(--color-success-text)",
  "Partially Opened": "bg-(--color-brand-alert-light) text-(--color-brand-alert-text)",
  Sending: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
};

const SENT_AT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** The last few sends, newest first. */
export default function RecentActivityCard({ sends }: { sends: SendRow[] }) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 flex flex-col">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-(--color-text-primary)">Recent Activity</h2>
          <SampleBadge />
        </div>
        <button
          type="button"
          onClick={() => router.push("/shopkeeper/notifications/history")}
          className="text-[12px] font-semibold text-(--color-brand-primary) hover:underline cursor-pointer"
        >
          View all
        </button>
      </header>

      <ul className="mt-1 flex-1">
        {sends.map((send) => (
          <li
            key={send.id}
            className="flex items-center gap-3 py-3 border-b border-(--color-border-default) last:border-b-0"
          >
            <span className="w-14 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
              {send.design ? (
                <DesignPreview design={send.design.designJson} />
              ) : (
                <span className="flex aspect-2/1 items-center justify-center bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                  <CampaignOutlinedIcon sx={{ fontSize: 15 }} />
                </span>
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-semibold text-(--color-text-primary) truncate">
                {send.title}
              </span>
              <span className="block text-[11px] text-(--color-text-hint) mt-0.5">
                Sent to {send.audience.toLocaleString()} members
              </span>
              <span className="block text-[10.5px] text-(--color-text-hint) mt-0.5">
                {SENT_AT.format(send.sentAt)}
              </span>
            </span>

            <span
              className={`shrink-0 h-6 px-2.5 rounded-full text-[10px] font-semibold flex items-center ${
                STATUS_STYLE[send.status] ?? STATUS_STYLE.Delivered
              }`}
            >
              {send.status}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => router.push("/shopkeeper/notifications/history")}
        className="mt-3 flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        View all activity
        <ArrowForwardOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
    </section>
  );
}
