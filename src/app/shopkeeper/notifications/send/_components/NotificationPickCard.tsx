"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { SendableNotification } from "../_hooks/useSendableNotifications";

interface Props {
  item: SendableNotification;
  selected: boolean;
  onSelect: (item: SendableNotification) => void;
}

/** One choosable notification: its live banner, name and where it came from. */
export default function NotificationPickCard({ item, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(item)}
      className={`flex flex-col text-left rounded-2xl border bg-(--color-bg-surface) overflow-hidden transition-colors cursor-pointer ${
        selected
          ? "border-(--color-brand-primary) ring-1 ring-(--color-brand-primary)"
          : "border-(--color-border-default) hover:border-(--color-brand-primary)"
      }`}
    >
      <div className="relative">
        <DesignPreview design={item.design} />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-(--color-bg-surface) text-[10px] font-semibold text-(--color-text-secondary) shadow-(--shadow-sm)">
          {item.badge}
        </span>
        {selected && (
          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-(--color-bg-surface) flex items-center justify-center shadow-(--shadow-sm)">
            <CheckCircleIcon
              sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
            />
          </span>
        )}
      </div>

      <div className="px-3 py-2.5">
        <h3 className="text-[12.5px] font-semibold text-(--color-text-primary) truncate">
          {item.name}
        </h3>
        <p className="text-[10.5px] text-(--color-text-hint) mt-0.5 truncate">{item.meta}</p>
      </div>
    </button>
  );
}
