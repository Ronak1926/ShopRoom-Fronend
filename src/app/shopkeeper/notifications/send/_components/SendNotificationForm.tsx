"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NotificationsShell from "../../_components/NotificationsShell";
import { sendNotification } from "@/features/notifications/api";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import ChooseNotificationStep from "./ChooseNotificationStep";
import AudienceStep from "./AudienceStep";
import MessageStep from "./MessageStep";
import NotificationPreviewPanel from "./NotificationPreviewPanel";
import NotificationSummaryPanel from "./NotificationSummaryPanel";
import SendConfirmDialog from "./SendConfirmDialog";
import HowItWorksCard from "./HowItWorksCard";
import SendSkeleton from "./SendSkeleton";
import {
  useSendableNotifications,
  type SendableNotification,
} from "@/hooks/useSendableNotifications";
import { useShopAudience } from "@/hooks/useShopAudience";
import {
  DEFAULT_RADIUS_KM,
  SendNotificationSchema,
  type SendNotificationInput,
} from "../_schemas/sendNotification";

interface SendOutcome {
  ok: boolean;
  text: string;
}

/** Never surface a raw server or network error to the shopkeeper. */
function sendErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const message = (err as { response?: { data?: { message?: unknown } } }).response?.data
      ?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Could not send this notification. Please try again.";
}

export default function SendNotificationForm() {
  const router = useRouter();
  const sources = useSendableNotifications();
  const { shop, loading: shopLoading } = useShopAudience();
  const preferences = useNotificationPreferences();

  // Held beside the form: the id alone is not enough to draw the preview, and
  // the list it came from is re-fetched per tab.
  const [selected, setSelected] = useState<SendableNotification | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<SendOutcome | null>(null);

  const { control, handleSubmit, setValue, formState } = useForm<SendNotificationInput>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      source: "DESIGN",
      notificationId: "",
      audience: "ROOM_MEMBERS",
      radiusKm: DEFAULT_RADIUS_KM,
      message: "",
    },
  });

  const audience = useWatch({ control, name: "audience" });
  const radiusKm = useWatch({ control, name: "radiusKm" });
  const message = useWatch({ control, name: "message" });

  function handlePick(item: SendableNotification) {
    setSelected(item);
    setOutcome(null);
    setValue("source", item.source, { shouldValidate: true });
    setValue("notificationId", item.id, { shouldValidate: true });
  }

  async function dispatchSend(values: SendNotificationInput) {
    setSending(true);
    try {
      const result = await sendNotification({
        source: values.source,
        notificationId: values.notificationId,
        audience: { mode: values.audience, radiusKm: values.radiusKm },
        ...(values.message.trim() ? { message: values.message.trim() } : {}),
      });
      setOutcome({
        ok: true,
        text: `Sent — queued for ${result.recipients.toLocaleString()} people.`,
      });
    } catch (err) {
      setOutcome({ ok: false, text: sendErrorMessage(err) });
    } finally {
      setSending(false);
      setConfirming(false);
    }
  }

  const onSubmit = handleSubmit((values) => {
    setOutcome(null);
    // "Confirm before sending" is a Preferences setting; honour it here.
    if (preferences.values.confirmBeforeSending) {
      setConfirming(true);
      return;
    }
    void dispatchSend(values);
  });

  const confirmSend = handleSubmit((values) => dispatchSend(values));

  return (
    <NotificationsShell
      title="Send Notification"
      description="Send a notification to your room members, or to anyone near your shop."
      icon={SendOutlinedIcon}
      headerAside={
        <button
          type="button"
          onClick={() => setShowHowItWorks((v) => !v)}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) text-[12px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
        >
          <InfoOutlinedIcon sx={{ fontSize: 15 }} />
          How it works
        </button>
      }
    >
      {shopLoading ? (
        <SendSkeleton />
      ) : (
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start"
        >
          <div className="flex flex-col gap-5 min-w-0">
            {showHowItWorks && <HowItWorksCard onClose={() => setShowHowItWorks(false)} />}

            <ChooseNotificationStep
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

            <AudienceStep
              mode={audience}
              onModeChange={(mode) => setValue("audience", mode, { shouldValidate: true })}
              radiusKm={radiusKm}
              onRadiusChange={(km) => setValue("radiusKm", km, { shouldValidate: true })}
              shop={shop}
            />

            <MessageStep
              value={message}
              onChange={(value) => setValue("message", value, { shouldValidate: true })}
              error={formState.errors.message?.message}
            />

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

            <div className="flex items-center justify-end gap-2.5 pb-1">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-10 px-5 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 h-10 px-5 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendOutlinedIcon sx={{ fontSize: 16 }} />
                {sending ? "Sending…" : "Send Now"}
              </button>
            </div>
          </div>

          <aside className="flex flex-col gap-5 xl:sticky xl:top-0">
            <NotificationPreviewPanel item={selected} message={message} shop={shop} />
            <NotificationSummaryPanel
              item={selected}
              mode={audience}
              radiusKm={radiusKm}
              message={message}
              shop={shop}
            />
          </aside>
        </form>
      )}

      {confirming && (
        <SendConfirmDialog
          name={selected?.name ?? "This notification"}
          mode={audience}
          radiusKm={radiusKm}
          sending={sending}
          onCancel={() => setConfirming(false)}
          onConfirm={() => void confirmSend()}
        />
      )}
    </NotificationsShell>
  );
}
