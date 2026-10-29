"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NotificationsShell from "../../_components/NotificationsShell";
import DesignPreview from "@/components/notifications/DesignPreview";
import {
  cancelSchedule,
  getCapabilities,
  listDesigns,
  listSchedules,
  setScheduleStatus,
  type DesignSummary,
  type PlanCapabilities,
  type SchedulePage,
} from "@/features/notifications/api";
import DailyLimitStrip from "./DailyLimitStrip";
import PreferencesRail from "./PreferencesRail";
import ScheduledRow from "./ScheduledRow";
import SchedulePreviewModal from "./SchedulePreviewModal";
import ScheduledSkeleton from "./ScheduledSkeleton";
import { groupByDay, toScheduledItem, type ScheduledItem } from "../_utils/scheduleView";

type Tab = "upcoming" | "completed" | "drafts";

const GROUP_DATE = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Must match STORAGE_KEY in useNotificationDesign — the Studio opens whatever
 *  design id it finds here. */
const STUDIO_DESIGN_KEY = "studio_design_id";

/** The page keeps up to one full page of each list; 50 is the API's ceiling. */
const PAGE_SIZE = 50;

function errorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const message = (err as { response?: { data?: { message?: unknown } } }).response?.data
      ?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export default function ScheduledNotifications() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [drafts, setDrafts] = useState<DesignSummary[]>([]);
  const [upcoming, setUpcoming] = useState<SchedulePage | null>(null);
  const [completed, setCompleted] = useState<SchedulePage | null>(null);
  const [plan, setPlan] = useState<{
    planType: string;
    capabilities: PlanCapabilities;
    usedToday: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<ScheduledItem | null>(null);

  const load = useCallback(async () => {
    try {
      const [up, done, designs, capabilities] = await Promise.all([
        listSchedules("upcoming", { limit: PAGE_SIZE }),
        listSchedules("completed", { limit: PAGE_SIZE }),
        listDesigns({ archived: false, status: "DRAFT", limit: 12 }),
        getCapabilities(),
      ]);
      setUpcoming(up);
      setCompleted(done);
      setDrafts(designs.items);
      setPlan(capabilities);
      setLoadError(null);
    } catch (err) {
      setLoadError(errorMessage(err, "Could not load your schedules."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(id: string, action: () => Promise<unknown>, failure: string) {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setActionError(errorMessage(err, failure));
    } finally {
      setBusyId(null);
    }
  }

  const handleToggle = (item: ScheduledItem) =>
    runAction(
      item.id,
      () => setScheduleStatus(item.id, item.status === "PAUSED" ? "ACTIVE" : "PAUSED"),
      "Could not update this schedule.",
    );

  const handleCancel = (item: ScheduledItem) =>
    runAction(item.id, () => cancelSchedule(item.id), "Could not cancel this schedule.");

  const upcomingItems = useMemo(() => (upcoming?.items ?? []).map(toScheduledItem), [upcoming]);
  const completedItems = useMemo(() => (completed?.items ?? []).map(toScheduledItem), [completed]);

  const listed = tab === "completed" ? completedItems : upcomingItems;
  const groups = useMemo(
    () => groupByDay(listed, tab === "completed" ? "desc" : "asc"),
    [listed, tab],
  );

  function openDraft(id: string) {
    try {
      localStorage.setItem(STUDIO_DESIGN_KEY, id);
    } catch {
      // Private mode: the Studio opens on its own last design instead.
    }
    router.push("/shopkeeper/notifications/studio");
  }

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcoming?.total ?? 0 },
    { id: "completed", label: "Completed", count: completed?.total ?? 0 },
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
      ) : loadError && !upcoming ? (
        <section
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border-strong) bg-(--color-bg-surface) py-16 px-6 text-center"
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 26, color: "var(--color-danger)" }} />
          <p className="text-[13px] text-(--color-text-secondary)">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void load();
            }}
            className="h-9 px-4 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
          >
            Try again
          </button>
        </section>
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

            {actionError && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-(--color-danger-bg) px-3 py-2.5 text-[12px] text-(--color-danger)"
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} className="mt-0.5 shrink-0" />
                {actionError}
              </p>
            )}

            {plan && (
              <DailyLimitStrip
                planType={plan.planType}
                dailyLimit={plan.capabilities.dailyNotificationLimit}
                usedToday={plan.usedToday}
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
                    </div>

                    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) overflow-hidden">
                      {group.items.map((item) => (
                        <ScheduledRow
                          key={item.id}
                          item={item}
                          busy={busyId === item.id}
                          onPreview={setPreviewing}
                          onToggle={handleToggle}
                          onCancel={handleCancel}
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
