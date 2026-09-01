"use client";

import { useRouter } from "next/navigation";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import SampleBadge from "@/components/ui/SampleBadge";
import type { SendRow } from "../_data/sampleMetrics";

/** Must match STORAGE_KEY in useNotificationDesign — the Studio opens whatever
 *  design id it finds here. */
const STUDIO_DESIGN_KEY = "studio_design_id";

const TH =
  "text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) pb-2 border-b border-(--color-border-default) text-left";
const TD = "border-b border-(--color-border-default) h-16 align-middle text-[12px]";

const TYPE_STYLE: Record<string, string> = {
  Promotional: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
  "Restock Alert": "bg-(--color-success-light) text-(--color-success-text)",
};

const SENT_ON = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const SENT_AT = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });

export default function RecentNotificationsTable({ sends }: { sends: SendRow[] }) {
  const router = useRouter();

  function openInStudio(send: SendRow) {
    if (!send.design) return;
    try {
      localStorage.setItem(STUDIO_DESIGN_KEY, send.design.id);
    } catch {
      // Private mode: the Studio opens on its own last design instead.
    }
    router.push("/shopkeeper/notifications/studio");
  }

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex items-center gap-2">
        <h2 className="text-[14px] font-bold text-(--color-text-primary)">
          Recent Notifications
        </h2>
        <SampleBadge />
      </header>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className={`${TH} w-[30%]`}>Title</th>
              <th className={TH}>Type</th>
              <th className={TH}>Audience</th>
              <th className={TH}>Sent on</th>
              <th className={TH}>Delivery</th>
              <th className={TH}>Open rate</th>
              <th className={TH}>Click rate</th>
              <th className={`${TH} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sends.map((send) => (
              <tr key={send.id}>
                <td className={TD}>
                  <span className="flex items-center gap-2.5">
                    <span className="w-12 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
                      {send.design ? (
                        <DesignPreview design={send.design.designJson} />
                      ) : (
                        <span className="flex aspect-2/1 items-center justify-center bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                          <CampaignOutlinedIcon sx={{ fontSize: 13 }} />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-(--color-text-primary) truncate">
                        {send.title}
                      </span>
                      <span className="block text-[10.5px] text-(--color-text-hint) truncate">
                        {send.body}
                      </span>
                    </span>
                  </span>
                </td>
                <td className={TD}>
                  <span
                    className={`inline-flex h-6 px-2.5 rounded-full text-[10.5px] font-semibold items-center ${
                      TYPE_STYLE[send.type] ?? TYPE_STYLE.Promotional
                    }`}
                  >
                    {send.type}
                  </span>
                </td>
                <td className={`${TD} text-(--color-text-secondary) tabular-nums`}>
                  {send.audience.toLocaleString()}
                </td>
                <td className={`${TD} text-(--color-text-secondary)`}>
                  <span className="block">{SENT_ON.format(send.sentAt)}</span>
                  <span className="block text-[10.5px] text-(--color-text-hint)">
                    {SENT_AT.format(send.sentAt)}
                  </span>
                </td>
                <td className={TD}>
                  <span className="flex items-center gap-1.5 text-(--color-text-primary) tabular-nums">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--color-online)" />
                    {send.deliveryRate}%
                  </span>
                </td>
                <td className={`${TD} text-(--color-text-secondary) tabular-nums`}>
                  {send.openRate}%
                </td>
                <td className={`${TD} text-(--color-text-secondary) tabular-nums`}>
                  {send.clickRate}%
                </td>
                <td className={`${TD} text-right`}>
                  <button
                    type="button"
                    disabled={!send.design}
                    onClick={() => openInStudio(send)}
                    title={
                      send.design ? "Open this design in the Studio" : "No design linked yet"
                    }
                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => router.push("/shopkeeper/notifications/history")}
        className="mt-4 w-full flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        View all notifications
        <ArrowForwardOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
    </section>
  );
}
