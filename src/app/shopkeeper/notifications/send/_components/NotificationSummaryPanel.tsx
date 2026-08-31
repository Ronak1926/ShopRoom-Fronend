"use client";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TYPE_LABELS } from "@/features/notifications/preferences";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import type { SendableNotification } from "../_hooks/useSendableNotifications";
import type { ShopAudience } from "../_hooks/useShopAudience";
import { AUDIENCE_LABELS, usesRadius, type AudienceMode } from "../_schemas/sendNotification";

interface Props {
  item: SendableNotification | null;
  mode: AudienceMode;
  radiusKm: number;
  message: string;
  shop: ShopAudience | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-(--color-border-default) last:border-b-0">
      <span className="text-[12px] text-(--color-text-secondary) shrink-0">{label}</span>
      <span className="text-[12px] font-medium text-(--color-text-primary) text-right break-words">
        {value}
      </span>
    </div>
  );
}

export default function NotificationSummaryPanel({
  item,
  mode,
  radiusKm,
  message,
  shop,
}: Props) {
  // The defaults the shopkeeper set under Preferences are what this send uses.
  const { values } = useNotificationPreferences();

  const audience = usesRadius(mode)
    ? `${AUDIENCE_LABELS[mode]} · within ${radiusKm} km`
    : `${AUDIENCE_LABELS[mode]}${shop ? ` (${shop.membersCount.toLocaleString()})` : ""}`;

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">
        Notification Summary
      </h2>

      <div className="mt-2">
        <Row label="Notification" value={item ? item.name : "—"} />
        <Row label="Type" value={TYPE_LABELS[values.defaultType] ?? values.defaultType} />
        <Row label="Audience" value={audience} />
        {usesRadius(mode) && (
          <Row label="Centre" value={shop?.place || "Your shop address"} />
        )}
        <Row label="Delivery" value="Instant" />
        <Row label="Schedule" value="—" />
        <Row label="Custom message" value={message.trim() || "—"} />
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-(--color-brand-primary-light) px-3 py-2.5 text-[11.5px] leading-relaxed text-(--color-text-secondary)">
        <InfoOutlinedIcon
          sx={{ fontSize: 15, color: "var(--color-brand-primary)" }}
          className="mt-0.5 shrink-0"
        />
        <span>
          This notification will be sent immediately. There is no scheduling in this flow.
        </span>
      </p>
    </section>
  );
}
