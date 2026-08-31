"use client";

import StepCard from "./StepCard";
import { MESSAGE_MAX_LENGTH } from "../_schemas/sendNotification";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function MessageStep({ value, onChange, error }: Props) {
  return (
    <StepCard step={3} title="Message (Optional)">
      <div className="mt-4">
        <label
          htmlFor="send-message"
          className="block text-[12.5px] font-semibold text-(--color-text-primary)"
        >
          Custom message
        </label>
        <p className="text-[11px] text-(--color-text-hint) mt-0.5">
          Add a short line of your own. It appears under the banner, in the message area of the
          notification.
        </p>

        <div className="relative mt-2.5">
          <textarea
            id="send-message"
            rows={4}
            maxLength={MESSAGE_MAX_LENGTH}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Don't miss out on our latest collection!"
            className={`w-full rounded-xl border bg-(--color-bg-surface) px-3.5 pt-3 pb-7 text-[12.5px] leading-relaxed text-(--color-text-primary) placeholder:text-(--color-text-hint) resize-none outline-none transition-colors ${
              error
                ? "border-(--color-danger)"
                : "border-(--color-border-default) focus:border-(--color-brand-primary)"
            }`}
          />
          <span className="absolute bottom-2.5 right-3.5 text-[10.5px] text-(--color-text-hint) tabular-nums">
            {value.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>

        {error && <p className="mt-1.5 text-[11.5px] text-(--color-danger)">{error}</p>}
      </div>
    </StepCard>
  );
}
