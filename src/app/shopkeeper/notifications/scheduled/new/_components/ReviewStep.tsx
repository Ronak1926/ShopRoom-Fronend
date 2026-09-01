"use client";

import type { ElementType, ReactNode } from "react";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { SendableNotification } from "@/hooks/useSendableNotifications";
import type { ShopAudience } from "@/hooks/useShopAudience";
import {
  describeAudience,
  describeRecurrence,
  formatWhen,
  type ScheduleInput,
  type WizardStep,
} from "../../_schemas/schedule";

function Card({
  icon: Icon,
  step,
  title,
  onEdit,
  children,
}: {
  icon: ElementType;
  step: number;
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-(--color-border-default) p-4">
      <header className="flex items-center gap-3">
        <span className="w-9 h-9 shrink-0 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
          <Icon sx={{ fontSize: 17 }} />
        </span>
        <h3 className="flex-1 text-[13px] font-bold text-(--color-text-primary)">
          {step}. {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-(--color-border-default) text-[11.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
        >
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
          Edit
        </button>
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-[12px] text-(--color-text-secondary) shrink-0">{label}</span>
      <span className="text-[12px] font-medium text-(--color-text-primary) text-right">
        {value}
      </span>
    </div>
  );
}

interface Props {
  values: ScheduleInput;
  selected: SendableNotification | null;
  shop: ShopAudience | null;
  typeLabel: string;
  timeZone: string;
  onEditStep: (step: WizardStep) => void;
}

/** Step 4 — everything in one place before it goes on the calendar. */
export default function ReviewStep({
  values,
  selected,
  shop,
  typeLabel,
  timeZone,
  onEditStep,
}: Props) {
  const when = formatWhen(values.date, values.time);

  return (
    <div className="flex flex-col gap-3">
      <Card
        icon={MailOutlineOutlinedIcon}
        step={1}
        title="Notification"
        onEdit={() => onEditStep("notification")}
      >
        <Row label="Title" value={selected?.name ?? "—"} />
        <Row label="Type" value={typeLabel} />
        <Row label="Source" value={selected?.meta ?? "—"} />
      </Card>

      <Card
        icon={PeopleOutlineOutlinedIcon}
        step={2}
        title="Audience"
        onEdit={() => onEditStep("audience")}
      >
        <Row label="Sending to" value={describeAudience(values)} />
        {values.includeMembers && (
          <Row
            label="Room members"
            value={shop ? shop.membersCount.toLocaleString() : "—"}
          />
        )}
        {values.includeNearby && (
          <Row
            label="Radius"
            value={`${values.radiusKm} km from ${shop?.place || "your shop"}`}
          />
        )}
        <Row
          label="Joins before send"
          value={values.includeFutureMembers ? "Included" : "Excluded"}
        />
        <Row
          label="Notifications off"
          value={values.skipNotificationsOff ? "Skipped" : "Included"}
        />
      </Card>

      <Card
        icon={CalendarMonthOutlinedIcon}
        step={3}
        title="Schedule"
        onEdit={() => onEditStep("schedule")}
      >
        <Row label="First send" value={when} />
        <Row label="Time zone" value={timeZone} />
        <Row label="Recurrence" value={describeRecurrence(values)} />
      </Card>

      <Card
        icon={SendOutlinedIcon}
        step={4}
        title="Delivery"
        onEdit={() => onEditStep("schedule")}
      >
        <Row
          label="Delivery speed"
          value={values.deliverySpeed === "PRIORITY" ? "High priority" : "Standard delivery"}
        />
      </Card>

      <p className="flex items-start gap-2 rounded-xl bg-(--color-brand-primary-light) px-3.5 py-3 text-[12px] leading-relaxed text-(--color-text-secondary)">
        <InfoOutlinedIcon
          sx={{ fontSize: 15, color: "var(--color-brand-primary)" }}
          className="mt-0.5 shrink-0"
        />
        <span>
          This notification will be sent to {describeAudience(values).toLowerCase()} on {when}
          {values.recurrence === "ONCE" ? "." : `, ${describeRecurrence(values).toLowerCase()}.`}
        </span>
      </p>
    </div>
  );
}
