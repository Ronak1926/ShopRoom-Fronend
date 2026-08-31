"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NotificationsShell from "../../_components/NotificationsShell";
import {
  CHANNELS,
  CHANNEL_LABELS,
  EXPIRY_HOURS,
  FONT_FAMILIES,
  LANGUAGES,
  LANGUAGE_LABELS,
  NOTIFICATION_TYPES,
  PRIORITIES,
  PRIORITY_LABELS,
  PreferencesSchema,
  TIME_ZONES,
  TYPE_LABELS,
  expiryLabel,
  timeZoneLabel,
  type NotificationPreferences,
} from "@/features/notifications/preferences";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import {
  CheckboxChips,
  ColorField,
  PreferenceCard,
  PreferenceRow,
  RadioRow,
  SelectField,
  Segmented,
  SliderField,
  Stepper,
  TimeField,
  Toggle,
} from "./PreferenceControls";

const opts = <T extends string | number>(
  values: readonly T[],
  label: (v: T) => string,
) => values.map((value) => ({ value, label: label(value) }));

/** Long enough that dragging the radius slider writes once, not fifty times. */
const AUTOSAVE_DELAY_MS = 400;

type SaveStatus = "idle" | "saving" | "saved" | "invalid";

export default function PreferencesForm() {
  const { values, loaded, save } = useNotificationPreferences();
  const [saved, setSaved] = useState(false);

  const { control, reset, formState } = useForm<NotificationPreferences>({
    resolver: zodResolver(PreferencesSchema),
    defaultValues: values,
    mode: "onChange",
  });

  // Stored values only arrive after mount, so the form is seeded then — and
  // again after every autosave, which is what puts the form back to clean.
  useEffect(() => {
    if (loaded) reset(values);
  }, [loaded, values, reset]);

  /**
   * Autosave — there is no Save button. An edit schedules the write a moment
   * later so a dragged slider settles first, and a further edit replaces the
   * pending one.
   *
   * Guarded on `isDirty`, so neither the pass that seeds the form nor the one
   * after each save — when the stored values arrive back — is written straight
   * out again.
   */
  const edited = useWatch({ control });
  const dirty = formState.isDirty;

  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      const parsed = PreferencesSchema.safeParse(edited);
      // Invalid input stays on screen unsaved; the row shows what is wrong.
      if (!parsed.success) return;
      save(parsed.data);
      setSaved(true);
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [edited, dirty, save]);

  // Derived rather than stored, so the pill cannot drift out of step with the
  // form it is describing. Read off the errors rather than `isValid`, which is
  // briefly false on mount before the resolver has run.
  const channelError = formState.errors.channels?.message;
  const status: SaveStatus = Object.keys(formState.errors).length
    ? "invalid"
    : dirty
      ? "saving"
      : saved
        ? "saved"
        : "idle";

  return (
    <NotificationsShell
      title="Preferences"
      description="Set your default preferences for notifications."
      icon={TuneOutlinedIcon}
      // headerAside={<SaveStatus status={status} />}
    >
      {!loaded ? (
        <PreferencesSkeleton />
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <PreferenceCard
              icon={SettingsOutlinedIcon}
              title="General Settings"
            >
              <PreferenceRow
                label="Default notification type"
                description="Choose the default type when creating new notifications."
                htmlFor="pref-type"
              >
                <Controller
                  control={control}
                  name="defaultType"
                  render={({ field }) => (
                    <SelectField
                      id="pref-type"
                      label="Default notification type"
                      value={field.value}
                      options={opts(NOTIFICATION_TYPES, (v) => TYPE_LABELS[v])}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default priority"
                description="Set the default priority for notifications."
                htmlFor="pref-priority"
              >
                <Controller
                  control={control}
                  name="defaultPriority"
                  render={({ field }) => (
                    <SelectField
                      id="pref-priority"
                      label="Default priority"
                      value={field.value}
                      options={opts(PRIORITIES, (v) => PRIORITY_LABELS[v])}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default language"
                description="Language for templates and editor."
                htmlFor="pref-language"
              >
                <Controller
                  control={control}
                  name="language"
                  render={({ field }) => (
                    <SelectField
                      id="pref-language"
                      label="Default language"
                      value={field.value}
                      options={opts(LANGUAGES, (v) => LANGUAGE_LABELS[v])}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Time zone"
                description="Used for scheduling and timestamps."
                htmlFor="pref-timezone"
              >
                <Controller
                  control={control}
                  name="timeZone"
                  render={({ field }) => (
                    <SelectField
                      id="pref-timezone"
                      label="Time zone"
                      value={field.value}
                      options={opts(TIME_ZONES, timeZoneLabel)}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>
            </PreferenceCard>

            <PreferenceCard
              icon={PaletteOutlinedIcon}
              title="Design Preferences"
            >
              <PreferenceRow
                label="Default notification format"
                description="Choose the default format in Notification Studio."
              >
                <Controller
                  control={control}
                  name="defaultFormat"
                  render={({ field }) => (
                    <Segmented
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "BANNER", label: "Banner (Collapsed)" },
                        { value: "EXPANDED", label: "Expanded" },
                      ]}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default background"
                description="Background for new notifications."
              >
                <Controller
                  control={control}
                  name="defaultBackground"
                  render={({ field }) => (
                    <RadioRow
                      name="pref-background"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "WHITE", label: "White" },
                        { value: "TRANSPARENT", label: "Transparent" },
                      ]}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default corner radius"
                description="Corner radius for cards and containers."
                htmlFor="pref-radius"
              >
                <Controller
                  control={control}
                  name="cornerRadius"
                  render={({ field }) => (
                    <SliderField
                      id="pref-radius"
                      value={field.value}
                      min={0}
                      max={48}
                      unit="px"
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default font family"
                description="Font family for new text elements."
                htmlFor="pref-font"
              >
                <Controller
                  control={control}
                  name="fontFamily"
                  render={({ field }) => (
                    <SelectField
                      id="pref-font"
                      label="Default font family"
                      value={field.value}
                      options={opts(FONT_FAMILIES, (v) => v)}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default primary color"
                description="Primary color for buttons and highlights."
                htmlFor="pref-color"
              >
                <Controller
                  control={control}
                  name="primaryColor"
                  render={({ field }) => (
                    <ColorField
                      id="pref-color"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>
            </PreferenceCard>

            <PreferenceCard
              icon={DescriptionOutlinedIcon}
              title="Content Preferences"
            >
              {(
                [
                  [
                    "showAppLogo",
                    "Show app logo by default",
                    "Add your app logo in new notifications.",
                  ],
                  [
                    "showTimestamp",
                    "Show timestamp in preview",
                    "Display time in the notification preview.",
                  ],
                  [
                    "showSafeArea",
                    "Show safe area guides",
                    "Show safe area while designing.",
                  ],
                  [
                    "contentSuggestions",
                    "Enable content suggestions",
                    "Get smart suggestions while building content.",
                  ],
                ] as const
              ).map(([name, label, description]) => (
                <PreferenceRow
                  key={name}
                  label={label}
                  description={description}
                >
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Toggle
                        checked={field.value}
                        onChange={field.onChange}
                        label={label}
                      />
                    )}
                  />
                </PreferenceRow>
              ))}
            </PreferenceCard>

            <PreferenceCard
              icon={ScheduleOutlinedIcon}
              title="Scheduling Preferences"
            >
              <PreferenceRow
                label="Default schedule type"
                description="Choose the default scheduling option."
              >
                <Controller
                  control={control}
                  name="scheduleType"
                  render={({ field }) => (
                    <Segmented
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "NOW", label: "Send Now" },
                        { value: "SCHEDULE", label: "Schedule" },
                      ]}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Default expiry time"
                description="Time after which notification expires."
                htmlFor="pref-expiry"
              >
                <Controller
                  control={control}
                  name="expiryHours"
                  render={({ field }) => (
                    <SelectField
                      id="pref-expiry"
                      label="Default expiry time"
                      value={field.value}
                      options={opts(EXPIRY_HOURS, expiryLabel)}
                      onChange={field.onChange}
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Quiet hours"
                description="Pause non-urgent notifications during these hours."
              >
                <div className="flex w-full items-center gap-2">
                  <Controller
                    control={control}
                    name="quietFrom"
                    render={({ field }) => (
                      <TimeField
                        id="pref-quiet-from"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <span className="text-[11px] text-(--color-text-hint)">
                    to
                  </span>
                  <Controller
                    control={control}
                    name="quietTo"
                    render={({ field }) => (
                      <TimeField
                        id="pref-quiet-to"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </PreferenceRow>

              <PreferenceRow
                label="Weekend sending"
                description="Allow notifications to be sent on weekends."
              >
                <Controller
                  control={control}
                  name="weekendSending"
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={field.onChange}
                      label="Weekend sending"
                    />
                  )}
                />
              </PreferenceRow>
            </PreferenceCard>

            <PreferenceCard
              icon={SendOutlinedIcon}
              title="Delivery Preferences"
            >
              <PreferenceRow
                label="Default channels"
                description="Channels selected by default."
                stack
              >
                <Controller
                  control={control}
                  name="channels"
                  render={({ field }) => (
                    <CheckboxChips
                      value={field.value}
                      onChange={field.onChange}
                      options={opts(CHANNELS, (v) => CHANNEL_LABELS[v])}
                    />
                  )}
                />
                {channelError && (
                  <p className="mt-1.5 text-[11px] text-(--color-danger)">
                    {channelError}
                  </p>
                )}
              </PreferenceRow>

              <PreferenceRow
                label="Retry failed notifications"
                description="Automatically retry failed notifications."
              >
                <Controller
                  control={control}
                  name="retryFailed"
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={field.onChange}
                      label="Retry failed"
                    />
                  )}
                />
              </PreferenceRow>

              <PreferenceRow
                label="Max retry attempts"
                description="Maximum number of retry attempts."
              >
                <Controller
                  control={control}
                  name="maxRetries"
                  render={({ field }) => (
                    <Stepper
                      value={field.value}
                      min={0}
                      max={10}
                      onChange={field.onChange}
                      label="max retry attempts"
                    />
                  )}
                />
              </PreferenceRow>
            </PreferenceCard>

            <PreferenceCard
              icon={TuneOutlinedIcon}
              title="Advanced Preferences"
            >
              {(
                [
                  [
                    "analyticsTracking",
                    "Enable analytics tracking",
                    "Track performance for all notifications.",
                  ],
                  [
                    "autoSaveDrafts",
                    "Auto save drafts",
                    "Automatically save while editing.",
                  ],
                  [
                    "confirmBeforeSending",
                    "Confirm before sending",
                    "Show confirmation before sending notifications.",
                  ],
                ] as const
              ).map(([name, label, description]) => (
                <PreferenceRow
                  key={name}
                  label={label}
                  description={description}
                >
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Toggle
                        checked={field.value}
                        onChange={field.onChange}
                        label={label}
                      />
                    )}
                  />
                </PreferenceRow>
              ))}
            </PreferenceCard>
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) px-5 py-4">
            <InfoOutlinedIcon
              sx={{ fontSize: 17, color: "var(--color-brand-primary)" }}
              className="mt-0.5 shrink-0"
            />
            <p className="text-[12px] leading-relaxed text-(--color-text-secondary)">
              These preferences apply across the Notification Studio and your
              notification workflows. You can always change them later.
              <span className="block text-(--color-text-hint) mt-0.5">
                Saved on this device — there is no preferences table on the
                server yet, so they will not follow you to another browser.
              </span>
            </p>
          </div>
        </form>
      )}
    </NotificationsShell>
  );
}

/** Sits on the page-title line in place of a Save button. */
function SaveStatus({ status }: { status: SaveStatus }) {
  const pill =
    "flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium";
  if (status === "invalid") {
    return (
      <span
        className={`${pill} bg-(--color-danger-bg) text-(--color-danger) font-semibold`}
      >
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} />
        Not saved — check the highlighted setting
      </span>
    );
  }
  if (status === "saving") {
    return (
      <span
        className={`${pill} border border-(--color-border-default) text-(--color-text-secondary)`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-brand-primary) animate-pulse" />
        Saving…
      </span>
    );
  }
  return (
    <span
      className={`${pill} border border-(--color-border-default) text-(--color-text-secondary)`}
    >
      <CheckCircleOutlinedIcon
        sx={{ fontSize: 15 }}
        className="text-(--color-success)"
      />
      {status === "saved" ? "Saved" : "Changes save automatically"}
    </span>
  );
}

/** Mirrors the real grid so the page does not jump when stored values load. */
function PreferencesSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5" aria-hidden>
      {Array.from({ length: 6 }, (_, card) => (
        <div
          key={card}
          className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-lg bg-(--color-bg-surface-hover)" />
            <span className="h-3.5 w-40 rounded bg-(--color-bg-surface-hover)" />
          </div>
          {Array.from({ length: 4 }, (_, row) => (
            <div key={row} className="flex items-center gap-4 py-3.5">
              <span className="flex flex-1 min-w-0 flex-col gap-1.5">
                <span className="h-3 w-44 max-w-full rounded bg-(--color-bg-surface-hover)" />
                <span className="h-2.5 w-56 max-w-full rounded bg-(--color-bg-surface-hover)" />
              </span>
              <span className="h-9 w-64 shrink-0 rounded-lg bg-(--color-bg-surface-hover)" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
