"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import NotificationsShell from "../../_components/NotificationsShell";
import SampleBadge from "@/components/ui/SampleBadge";
import DesignPreview from "@/components/notifications/DesignPreview";
import {
  getCapabilities,
  listDesigns,
  type DesignSummary,
  type PlanCapabilities,
} from "@/features/notifications/api";
import { useShopAudience } from "@/hooks/useShopAudience";
import DailyLimitStrip from "./DailyLimitStrip";
import PreferencesRail from "./PreferencesRail";
import ScheduledRow from "./ScheduledRow";
import SchedulePreviewModal from "./SchedulePreviewModal";
import ScheduledSkeleton from "./ScheduledSkeleton";
import {
  buildSampleSchedules,
  groupByDay,
  type ScheduledItem,
} from "../_data/sampleSchedules";

type Tab = "upcoming" | "completed" | "drafts";

const GROUP_DATE = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Must match STORAGE_KEY in useNotificationDesign — the Studio opens whatever
 *  design id it finds here. */
const STUDIO_DESIGN_KEY = "studio_design_id";

export default function ScheduledNotifications() {
  const router = useRouter();
  const { shop } = useShopAudience();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [drafts, setDrafts] = useState<DesignSummary[]>([]);
  const [plan, setPlan] = useState<{ planType: string; capabilities: PlanCapabilities } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState<ScheduledItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listDesigns({ archived: false, status: "DRAFT", limit: 12 }), getCapabilities()])
      .then(([designs, capabilities]) => {
        if (cancelled) return;
        setDrafts(designs.items);
        setPlan(capabilities);
      })
      .catch(() => {
        // The page still stands without them: the limit strip and the sample
        // rows simply fall back to what they can show.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const samples = useMemo(
    () => buildSampleSchedules(shop?.membersCount ?? 0, drafts),
    [shop?.membersCount, drafts],
  );

  const listed = tab === "completed" ? samples.completed : samples.upcoming;
  const groups = useMemo(() => groupByDay(listed), [listed]);

  function openDraft(id: string) {
    try {
      localStorage.setItem(STUDIO_DESIGN_KEY, id);
    } catch {
      // Private mode: the Studio opens on its own last design instead.
    }
    router.push("/shopkeeper/notifications/studio");
  }

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: samples.upcoming.length },
    { id: "completed", label: "Completed", count: samples.completed.length },
    { id: "drafts", label: "Drafts", count: drafts.length },
  ];

  return (
    <NotificationsShell
      title="Scheduled Notifications"
      description="Manage your upcoming notifications and schedules."
      icon={ScheduleOutlinedIcon}
      headerAside={
        <button
          type="button"
          onClick={() => router.push("/shopkeeper/notifications/scheduled/new")}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
        >
          <AddOutlinedIcon sx={{ fontSize: 17 }} />
          Schedule new
        </button>
      }
    >
      {loading ? (
        <ScheduledSkeleton />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start">
          <div className="flex flex-col gap-5 min-w-0">
            <div
              role="tablist"
              aria-label="Schedule state"
              className="flex items-center gap-1 border-b border-(--color-border-default)"
            >
              {TABS.map(({ id, label, count }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 h-10 px-3.5 -mb-px border-b-2 text-[13px] transition-colors cursor-pointer ${
                    tab === id
                      ? "border-(--color-brand-primary) text-(--color-brand-primary) font-semibold"
                      : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                  }`}
                >
                  {label}
                  <span
                    className={`h-5 min-w-5 px-1.5 rounded-full text-[10.5px] font-semibold flex items-center justify-center ${
                      tab === id
                        ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                        : "bg-(--color-bg-surface-hover) text-(--color-text-secondary)"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {plan && (
              <DailyLimitStrip
                planType={plan.planType}
                dailyLimit={plan.capabilities.dailyNotificationLimit}
                usedToday={0}
              />
            )}

            {tab === "drafts" ? (
              <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
                <h2 className="text-[14px] font-bold text-(--color-text-primary)">
                  Drafts ready to schedule
                </h2>
                <p className="text-[11.5px] text-(--color-text-hint) mt-0.5">
                  Designs saved in the Studio. Pick one to put it on the calendar.
                </p>

                {drafts.length === 0 ? (
                  <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--color-border-strong) py-10 px-6 text-center">
                    <p className="text-[12.5px] text-(--color-text-secondary)">
                      No drafts yet. Design one in the Studio and it shows up here.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push("/shopkeeper/notifications/studio")}
                      className="h-9 px-4 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
                    >
                      Open Notification Studio
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {drafts.map((draft) => (
                      <button
                        key={draft.id}
                        type="button"
                        onClick={() => openDraft(draft.id)}
                        className="flex flex-col text-left rounded-xl border border-(--color-border-default) overflow-hidden hover:border-(--color-brand-primary) transition-colors cursor-pointer"
                      >
                        <DesignPreview design={draft.designJson} />
                        <span className="px-2.5 py-2">
                          <span className="block text-[12px] font-semibold text-(--color-text-primary) truncate">
                            {draft.name}
                          </span>
                          <span className="block text-[10.5px] text-(--color-text-hint) mt-0.5">
                            v{draft.version} · {new Date(draft.updatedAt).toLocaleDateString()}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            ) : groups.length === 0 ? (
              <section className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border-strong) bg-(--color-bg-surface) py-16 px-6 text-center">
                <EventBusyOutlinedIcon sx={{ fontSize: 26, color: "var(--color-text-hint)" }} />
                <p className="text-[13px] text-(--color-text-secondary)">
                  Nothing {tab === "completed" ? "sent" : "queued"} yet.
                </p>
              </section>
            ) : (
              <div className="flex flex-col gap-5">
                {groups.map((group) => (
                  <section key={group.date.toISOString()}>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-[12.5px] font-bold text-(--color-text-primary)">
                        {group.label}
                      </h2>
                      <span className="text-[11.5px] text-(--color-text-hint)">
                        · {GROUP_DATE.format(group.date)}
                      </span>
                      <SampleBadge title="Schedules are not stored on the server yet." />
                    </div>

                    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) overflow-hidden">
                      {group.items.map((item) => (
                        <ScheduledRow
                          key={item.id}
                          item={item}
                          onPreview={setPreviewing}
                          onEdit={() =>
                            router.push("/shopkeeper/notifications/scheduled/new")
                          }
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          <PreferencesRail
            planType={plan?.planType}
            dailyLimit={plan?.capabilities.dailyNotificationLimit}
          />
        </div>
      )}

      {previewing && (
        <SchedulePreviewModal item={previewing} onClose={() => setPreviewing(null)} />
      )}
    </NotificationsShell>
  );
}
