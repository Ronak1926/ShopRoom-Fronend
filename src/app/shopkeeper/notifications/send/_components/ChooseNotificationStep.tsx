"use client";

import { useRouter } from "next/navigation";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import StepCard from "./StepCard";
import NotificationPickCard from "./NotificationPickCard";
import {
  SOURCE_TABS,
  type SendableNotification,
  type SourceTab,
} from "@/hooks/useSendableNotifications";

const GRID = "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3";

const EMPTY_COPY: Record<SourceTab, string> = {
  drafts: "Nothing saved yet. Designs you start in the Studio show up here.",
  mine: "No finished designs yet. Save a version in the Studio to send it.",
  favourites: "No favourites yet. Heart a template on the Templates page.",
};

interface Props {
  tab: SourceTab;
  onTabChange: (tab: SourceTab) => void;
  items: SendableNotification[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (item: SendableNotification) => void;
  onRetry: () => void;
  /** Set when nothing is picked and the send was attempted. */
  fieldError?: string;
}

export default function ChooseNotificationStep({
  tab,
  onTabChange,
  items,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
  fieldError,
}: Props) {
  const router = useRouter();

  return (
    <StepCard
      step={1}
      title="Choose Notification"
      action={
        <button
          type="button"
          onClick={() => router.push("/shopkeeper/notifications/templates")}
          className="flex items-center gap-1 text-[12px] font-semibold text-(--color-brand-primary) hover:underline cursor-pointer"
        >
          View all
          <ChevronRightOutlinedIcon sx={{ fontSize: 15 }} />
        </button>
      }
    >
      <div
        role="tablist"
        aria-label="Notification source"
        className="flex items-center gap-1 mt-4 border-b border-(--color-border-default)"
      >
        {SOURCE_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTabChange(id)}
            className={`h-9 px-3 -mb-px border-b-2 text-[12.5px] transition-colors cursor-pointer ${
              tab === id
                ? "border-(--color-brand-primary) text-(--color-brand-primary) font-semibold"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className={GRID} aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-(--color-border-default) overflow-hidden animate-pulse"
              >
                <div className="aspect-2/1 bg-(--color-bg-surface-hover)" />
                <div className="px-3 py-2.5 flex flex-col gap-1.5">
                  <span className="h-3 w-28 rounded bg-(--color-bg-surface-hover)" />
                  <span className="h-2.5 w-20 rounded bg-(--color-bg-surface-hover)" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--color-border-strong) py-10">
            <p className="text-[12.5px] text-(--color-text-secondary)">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
            >
              <RefreshOutlinedIcon sx={{ fontSize: 15 }} />
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--color-border-strong) py-10 px-6 text-center">
            <p className="text-[12.5px] text-(--color-text-secondary)">{EMPTY_COPY[tab]}</p>
            <button
              type="button"
              onClick={() => router.push("/shopkeeper/notifications/studio")}
              className="h-9 px-4 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
            >
              Open Notification Studio
            </button>
          </div>
        ) : (
          <div className={GRID}>
            {items.map((item) => (
              <NotificationPickCard
                key={`${item.source}-${item.id}`}
                item={item}
                selected={selectedId === item.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>

      {fieldError && (
        <p className="mt-3 text-[11.5px] text-(--color-danger)">{fieldError}</p>
      )}
    </StepCard>
  );
}
