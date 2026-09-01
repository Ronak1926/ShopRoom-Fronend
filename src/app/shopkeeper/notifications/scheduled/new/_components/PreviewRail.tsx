"use client";

import { useState } from "react";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Avatar from "@/components/ui/Avatar";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { SendableNotification } from "@/hooks/useSendableNotifications";
import type { ShopAudience } from "@/hooks/useShopAudience";
import {
  describeAudience,
  describeRecurrence,
  formatWhen,
  type ScheduleInput,
} from "../../_schemas/schedule";

const MODES = [
  { id: "banner", label: "Banner" },
  { id: "expanded", label: "Expanded" },
] as const;

type Mode = (typeof MODES)[number]["id"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-(--color-border-default) last:border-b-0">
      <span className="text-[11.5px] text-(--color-text-secondary) shrink-0">{label}</span>
      <span className="text-[11.5px] font-medium text-(--color-text-primary) text-right">
        {value}
      </span>
    </div>
  );
}

interface Props {
  selected: SendableNotification | null;
  shop: ShopAudience | null;
  values: ScheduleInput;
  typeLabel: string;
  /** True once the schedule step has been filled in. */
  showSchedule: boolean;
}

/** The phone's view of the notification, plus what is about to be scheduled. */
export default function PreviewRail({
  selected,
  shop,
  values,
  typeLabel,
  showSchedule,
}: Props) {
  const [mode, setMode] = useState<Mode>("banner");

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">Preview</h2>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-(--color-bg-page)">
            {MODES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={mode === option.id}
                onClick={() => setMode(option.id)}
                className={`h-7 px-2.5 rounded-md text-[11.5px] font-semibold transition-colors cursor-pointer ${
                  mode === option.id
                    ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                    : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-4 rounded-2xl border border-(--color-border-default) bg-(--color-bg-page) p-3">
          <div className="flex items-center gap-2">
            <Avatar
              name={shop?.shopName ?? "Your shop"}
              src={shop?.logoUrl}
              size="xs"
              shape="square"
            />
            <span className="text-[11px] font-semibold text-(--color-text-secondary) truncate">
              {shop?.shopName ?? "Your shop"}
            </span>
            <span className="text-[11px] text-(--color-text-hint)">
              · {values.time || "now"}
            </span>
          </div>

          <p className="mt-2 text-[13px] font-bold text-(--color-text-primary) truncate">
            {selected?.name ?? "Your notification"}
          </p>

          {mode === "expanded" ? (
            <div className="mt-2 rounded-xl overflow-hidden bg-(--color-bg-surface)">
              {selected ? (
                <DesignPreview design={selected.design} />
              ) : (
                <div className="aspect-2/1 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border-strong) text-center px-4">
                  <ImageOutlinedIcon sx={{ fontSize: 22, color: "var(--color-text-hint)" }} />
                  <p className="text-[11.5px] text-(--color-text-hint)">
                    Pick a draft to see it here.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-3">
              <p className="flex-1 text-[11.5px] leading-relaxed text-(--color-text-secondary)">
                Collapsed, the phone shows your shop name and the title. Tapping it expands the
                banner.
              </p>
              <span className="w-16 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
                {selected ? (
                  <DesignPreview design={selected.design} />
                ) : (
                  <span className="flex aspect-2/1 items-center justify-center bg-(--color-bg-surface)">
                    <ImageOutlinedIcon sx={{ fontSize: 15, color: "var(--color-text-hint)" }} />
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
        <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">
          {showSchedule ? "Schedule summary" : "Notification summary"}
        </h2>

        <div className="mt-2">
          <Row label="Notification" value={selected?.name ?? "—"} />
          <Row label="Type" value={typeLabel} />
          <Row label="Source" value={selected?.meta ?? "—"} />
          <Row label="Audience" value={describeAudience(values)} />
          {showSchedule && (
            <>
              <Row label="First send" value={formatWhen(values.date, values.time)} />
              <Row label="Recurrence" value={describeRecurrence(values)} />
              <Row
                label="Delivery"
                value={values.deliverySpeed === "PRIORITY" ? "High priority" : "Standard"}
              />
            </>
          )}
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-(--color-brand-primary-light) px-3 py-2.5 text-[11.5px] leading-relaxed text-(--color-text-secondary)">
          <InfoOutlinedIcon
            sx={{ fontSize: 15, color: "var(--color-brand-primary)" }}
            className="mt-0.5 shrink-0"
          />
          <span>
            {showSchedule
              ? "Nothing is sent until you confirm on the last step."
              : "You can review and confirm everything in the last step."}
          </span>
        </p>
      </section>
    </div>
  );
}
