"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NotificationsShell from "../../../_components/NotificationsShell";
import { createSchedule } from "@/features/notifications/api";
import { TYPE_LABELS, timeZoneLabel } from "@/features/notifications/preferences";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import {
  useSendableNotifications,
  type SendableNotification,
} from "@/hooks/useSendableNotifications";
import { useShopAudience } from "@/hooks/useShopAudience";
import WizardStepper from "./WizardStepper";
import WizardSection from "./WizardSection";
import SelectNotificationStep from "./SelectNotificationStep";
import AudienceStep from "./AudienceStep";
import ScheduleStep from "./ScheduleStep";
import ReviewStep from "./ReviewStep";
import PreviewRail from "./PreviewRail";
import {
  DEFAULT_RADIUS_KM,
  ScheduleSchema,
  WIZARD_STEPS,
  describeAudience,
  describeRecurrence,
  formatWhen,
  type ScheduleInput,
  type WizardStep,
} from "../../_schemas/schedule";

/** Fields each step owns, so "Next" only validates what is on screen. */
const STEP_FIELDS: Record<WizardStep, (keyof ScheduleInput)[]> = {
  notification: ["notificationId"],
  audience: ["includeMembers", "includeNearby", "radiusKm"],
  schedule: ["date", "time", "weekdays", "endDate", "endAfter", "repeatEvery"],
  review: [],
};

const NEXT_LABEL: Record<WizardStep, string> = {
  notification: "Next: Audience",
  audience: "Next: Schedule",
  schedule: "Next: Review & Confirm",
  review: "",
};

/** The next round hour, rolled to tomorrow morning if today has run out. */
function defaultSlot(): { date: string; time: string } {
  const at = new Date();
  at.setMinutes(0, 0, 0);
  at.setHours(at.getHours() + 1);
  if (at.getHours() >= 22) {
    at.setDate(at.getDate() + 1);
    at.setHours(9);
  }
  const offsetMs = at.getTimezoneOffset() * 60_000;
  const local = new Date(at.getTime() - offsetMs).toISOString();
  return { date: local.slice(0, 10), time: local.slice(11, 16) };
}

function scheduleErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const message = (err as { response?: { data?: { message?: unknown } } }).response?.data
      ?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Could not schedule this notification. Please try again.";
}

export default function ScheduleWizard() {
  const router = useRouter();
  const sources = useSendableNotifications();
  const { shop } = useShopAudience();
  const preferences = useNotificationPreferences();

  const [openStep, setOpenStep] = useState<WizardStep>("notification");
  const [completed, setCompleted] = useState<WizardStep[]>([]);
  const [selected, setSelected] = useState<SendableNotification | null>(null);
  const [saving, setSaving] = useState(false);
  const [outcome, setOutcome] = useState<{ ok: boolean; text: string } | null>(null);

  const slot = useMemo(defaultSlot, []);

  const { control, handleSubmit, setValue, trigger, reset, formState } =
    useForm<ScheduleInput>({
      resolver: zodResolver(ScheduleSchema),
      defaultValues: {
        source: "DESIGN",
        notificationId: "",
        includeMembers: true,
        includeNearby: true,
        radiusKm: DEFAULT_RADIUS_KM,
        includeFutureMembers: true,
        skipNotificationsOff: true,
        date: slot.date,
        time: slot.time,
        recurrence: "ONCE",
        repeatEvery: 1,
        weekdays: [],
        endMode: "NEVER",
        endDate: null,
        endAfter: null,
        deliverySpeed: "STANDARD",
      },
    });

  const values = useWatch({ control }) as ScheduleInput;

  function handlePick(item: SendableNotification) {
    setSelected(item);
    setOutcome(null);
    setValue("source", item.source, { shouldValidate: true });
    setValue("notificationId", item.id, { shouldValidate: true });
  }

  function markDone(step: WizardStep) {
    setCompleted((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }

  async function goNext(step: WizardStep) {
    const ok = await trigger(STEP_FIELDS[step]);
    if (!ok) return;
    markDone(step);
    const index = WIZARD_STEPS.findIndex((s) => s.id === step);
    const next = WIZARD_STEPS[index + 1];
    if (next) setOpenStep(next.id);
  }

  function goPrevious(step: WizardStep) {
    const index = WIZARD_STEPS.findIndex((s) => s.id === step);
    const previous = WIZARD_STEPS[index - 1];
    if (previous) setOpenStep(previous.id);
  }

  const onSubmit = handleSubmit(async (input) => {
    setSaving(true);
    setOutcome(null);
    try {
      const sendAt = new Date(`${input.date}T${input.time}`).toISOString();
      await createSchedule({
        source: input.source,
        notificationId: input.notificationId,
        audience: {
          includeMembers: input.includeMembers,
          includeNearby: input.includeNearby,
          radiusKm: input.radiusKm,
          includeFutureMembers: input.includeFutureMembers,
          skipNotificationsOff: input.skipNotificationsOff,
        },
        schedule: {
          sendAt,
          timeZone: preferences.values.timeZone,
          recurrence: input.recurrence,
          repeatEvery: input.repeatEvery,
          weekdays: input.weekdays,
          endMode: input.endMode,
          endDate: input.endDate,
          endAfter: input.endAfter,
          deliverySpeed: input.deliverySpeed,
        },
      });
      setOutcome({ ok: true, text: "Scheduled. You can manage it from the Scheduled list." });
      reset(input);
    } catch (err) {
      setOutcome({ ok: false, text: scheduleErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  });

  const typeLabel =
    TYPE_LABELS[preferences.values.defaultType] ?? preferences.values.defaultType;

  const summaries: Partial<Record<WizardStep, string>> = {
    notification: selected?.name,
    audience: completed.includes("audience") ? describeAudience(values) : undefined,
    schedule: completed.includes("schedule")
      ? `${formatWhen(values.date, values.time)} · ${describeRecurrence(values)}`
      : undefined,
  };

  const sectionHints: Record<WizardStep, string> = {
    notification: selected ? selected.name : "Choose a draft from your Notification Studio",
    audience: describeAudience(values),
    schedule: `${formatWhen(values.date, values.time)} · ${describeRecurrence(values)}`,
    review: "Review details and schedule",
  };

  return (
    <NotificationsShell
      title="Schedule New Notification"
      description="Choose a draft, pick who receives it, and set when it goes out."
      icon={ScheduleOutlinedIcon}
      headerAside={
        <button
          type="button"
          onClick={() => router.push("/shopkeeper/notifications/scheduled")}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) text-[12px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
        >
          <ArrowBackOutlinedIcon sx={{ fontSize: 15 }} />
          Back to scheduled
        </button>
      }
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 xl:grid-cols-[200px_minmax(0,1fr)_340px] gap-5 items-start"
      >
        <div className="xl:sticky xl:top-0">
          <WizardStepper
            current={openStep}
            completed={completed}
            summaries={summaries}
            onJump={setOpenStep}
          />
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          {WIZARD_STEPS.map((step, index) => (
            <WizardSection
              key={step.id}
              step={index + 1}
              title={step.title}
              hint={sectionHints[step.id]}
              open={openStep === step.id}
              done={completed.includes(step.id)}
              onToggle={() => setOpenStep(openStep === step.id ? "review" : step.id)}
            >
              {step.id === "notification" && (
                <SelectNotificationStep
                  tab={sources.tab}
                  onTabChange={sources.setTab}
                  items={sources.items}
                  loading={sources.loading}
                  error={sources.error}
                  selectedId={selected?.id ?? null}
                  onSelect={handlePick}
                  onRetry={sources.reload}
                  fieldError={formState.errors.notificationId?.message}
                />
              )}

              {step.id === "audience" && (
                <AudienceStep
                  includeMembers={values.includeMembers}
                  includeNearby={values.includeNearby}
                  radiusKm={values.radiusKm}
                  includeFutureMembers={values.includeFutureMembers}
                  skipNotificationsOff={values.skipNotificationsOff}
                  shop={shop}
                  fieldError={formState.errors.includeMembers?.message}
                  onChange={(patch) => {
                    for (const [key, value] of Object.entries(patch)) {
                      setValue(key as keyof ScheduleInput, value as never, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}

              {step.id === "schedule" && (
                <ScheduleStep
                  values={values}
                  timeZone={timeZoneLabel(preferences.values.timeZone)}
                  errors={{
                    date: formState.errors.date?.message,
                    time: formState.errors.time?.message,
                    weekdays: formState.errors.weekdays?.message,
                    endDate: formState.errors.endDate?.message,
                  }}
                  onChange={(patch) => {
                    for (const [key, value] of Object.entries(patch)) {
                      setValue(key as keyof ScheduleInput, value as never, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}

              {step.id === "review" && (
                <ReviewStep
                  values={values}
                  selected={selected}
                  shop={shop}
                  typeLabel={typeLabel}
                  timeZone={timeZoneLabel(preferences.values.timeZone)}
                  onEditStep={setOpenStep}
                />
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => goPrevious(step.id)}
                    className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
                  >
                    <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push("/shopkeeper/notifications/scheduled")}
                    className="h-10 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {step.id === "review" ? (
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 h-10 px-5 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                    {saving ? "Scheduling…" : "Schedule notification"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void goNext(step.id)}
                    className="flex items-center gap-2 h-10 px-5 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
                  >
                    {NEXT_LABEL[step.id]}
                    <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>
            </WizardSection>
          ))}

          {outcome && (
            <p
              className={`flex items-start gap-2 rounded-xl px-3.5 py-3 text-[12px] leading-relaxed ${
                outcome.ok
                  ? "bg-(--color-success-light) text-(--color-success-text)"
                  : "bg-(--color-danger-bg) text-(--color-danger)"
              }`}
            >
              {outcome.ok ? (
                <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} className="mt-0.5 shrink-0" />
              ) : (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} className="mt-0.5 shrink-0" />
              )}
              {outcome.text}
            </p>
          )}
        </div>

        <div className="xl:sticky xl:top-0">
          <PreviewRail
            selected={selected}
            shop={shop}
            values={values}
            typeLabel={typeLabel}
            showSchedule={completed.includes("schedule") || openStep === "review"}
          />
        </div>
      </form>
    </NotificationsShell>
  );
}
