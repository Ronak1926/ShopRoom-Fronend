"use client";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Dropdown from "@/components/ui/Dropdown";
import {
  RECURRENCE_OPTIONS,
  RECURRENCE_UNIT,
  WEEKDAY_LABELS,
  todayIso,
  type DeliverySpeed,
  type Recurrence,
} from "../../_schemas/schedule";

const REPEAT_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

const FIELD =
  "h-10 w-full rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) px-3 text-[12.5px] text-(--color-text-primary) outline-none transition-colors focus:border-(--color-brand-primary)";

interface Values {
  date: string;
  time: string;
  recurrence: Recurrence;
  repeatEvery: number;
  weekdays: number[];
  endMode: "NEVER" | "ON" | "AFTER";
  endDate: string | null;
  endAfter: number | null;
  deliverySpeed: DeliverySpeed;
}

interface Props {
  values: Values;
  timeZone: string;
  onChange: (patch: Partial<Values>) => void;
  errors: Partial<Record<keyof Values, string>>;
}

/** Step 3 — when it goes out, how often, and how fast. */
export default function ScheduleStep({ values, timeZone, onChange, errors }: Props) {
  const repeating = values.recurrence !== "ONCE";

  return (
    <div className="flex flex-col gap-6">
      <section>
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[12.5px] font-semibold text-(--color-text-primary)">
              Date & time
            </h3>
            <p className="text-[11px] text-(--color-text-hint) mt-0.5">
              Choose when you want to send this notification.
            </p>
          </div>
          <span className="flex items-center gap-1.5 h-8 px-3 shrink-0 rounded-lg border border-(--color-border-default) text-[11.5px] text-(--color-text-secondary)">
            <PublicOutlinedIcon sx={{ fontSize: 14 }} />
            Time zone: <span className="font-semibold">{timeZone}</span>
          </span>
        </header>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] text-(--color-text-secondary)">Schedule date</span>
            <input
              type="date"
              min={todayIso()}
              value={values.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className={FIELD}
            />
            {errors.date && (
              <span className="text-[11px] text-(--color-danger)">{errors.date}</span>
            )}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] text-(--color-text-secondary)">Schedule time</span>
            <input
              type="time"
              value={values.time}
              onChange={(e) => onChange({ time: e.target.value })}
              className={FIELD}
            />
            {errors.time && (
              <span className="text-[11px] text-(--color-danger)">{errors.time}</span>
            )}
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-[12.5px] font-semibold text-(--color-text-primary)">Recurrence</h3>
        <p className="text-[11px] text-(--color-text-hint) mt-0.5">
          Do you want to send this more than once?
        </p>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">
          {RECURRENCE_OPTIONS.map((option) => {
            const active = values.recurrence === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ recurrence: option.value })}
                className={`flex h-full flex-col gap-1 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  active
                    ? "border-(--color-brand-primary) bg-(--color-brand-primary-light)"
                    : "border-(--color-border-default) hover:border-(--color-brand-primary)"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      active
                        ? "border-(--color-brand-primary) bg-(--color-brand-primary) text-(--color-text-on-brand)"
                        : "border-(--color-border-strong)"
                    }`}
                  >
                    {active && <CheckOutlinedIcon sx={{ fontSize: 11 }} />}
                  </span>
                  <span className="text-[12.5px] font-semibold text-(--color-text-primary)">
                    {option.label}
                  </span>
                </span>
                <span className="text-[11px] leading-snug text-(--color-text-hint)">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        {repeating && (
          <div className="mt-3 rounded-xl border border-(--color-border-default) bg-(--color-bg-page) p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[12px] text-(--color-text-secondary)">Repeat every</span>
              <Dropdown
                value={values.repeatEvery}
                options={REPEAT_OPTIONS}
                onChange={(repeatEvery) => onChange({ repeatEvery })}
                ariaLabel="Repeat interval"
                className="w-20"
              />
              <span className="text-[12px] text-(--color-text-secondary)">
                {RECURRENCE_UNIT[values.recurrence]}
              </span>
            </div>

            {values.recurrence === "WEEKLY" && (
              <div>
                <span className="text-[12px] text-(--color-text-secondary)">On</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {WEEKDAY_LABELS.map((label, index) => {
                    const on = values.weekdays.includes(index);
                    return (
                      <button
                        key={index}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          onChange({
                            weekdays: on
                              ? values.weekdays.filter((d) => d !== index)
                              : [...values.weekdays, index].sort(),
                          })
                        }
                        className={`w-9 h-9 rounded-lg border text-[12px] font-semibold transition-colors cursor-pointer ${
                          on
                            ? "border-(--color-brand-primary) bg-(--color-brand-primary) text-(--color-text-on-brand)"
                            : "border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary)"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {errors.weekdays && (
                  <p className="mt-1.5 text-[11px] text-(--color-danger)">{errors.weekdays}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[12px] text-(--color-text-secondary)">Ends</span>
              {(
                [
                  ["NEVER", "Never"],
                  ["ON", "On"],
                  ["AFTER", "After"],
                ] as const
              ).map(([mode, label]) => (
                <label
                  key={mode}
                  className="flex items-center gap-1.5 text-[12px] text-(--color-text-secondary) cursor-pointer"
                >
                  <input
                    type="radio"
                    name="schedule-end"
                    checked={values.endMode === mode}
                    onChange={() => onChange({ endMode: mode })}
                    className="w-3.5 h-3.5 accent-(--color-brand-primary) cursor-pointer"
                  />
                  {label}
                </label>
              ))}

              {values.endMode === "ON" && (
                <input
                  type="date"
                  min={values.date}
                  value={values.endDate ?? ""}
                  onChange={(e) => onChange({ endDate: e.target.value || null })}
                  className={`${FIELD} w-44`}
                />
              )}

              {values.endMode === "AFTER" && (
                <span className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={values.endAfter ?? 1}
                    onChange={(e) => onChange({ endAfter: Number(e.target.value) })}
                    className={`${FIELD} w-20`}
                  />
                  <span className="text-[12px] text-(--color-text-secondary)">occurrences</span>
                </span>
              )}
            </div>
            {errors.endDate && (
              <p className="text-[11px] text-(--color-danger)">{errors.endDate}</p>
            )}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-[12.5px] font-semibold text-(--color-text-primary)">
          Delivery speed
        </h3>
        <p className="text-[11px] text-(--color-text-hint) mt-0.5">
          How fast the send fans out once the schedule fires.
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          {(
            [
              {
                value: "STANDARD" as const,
                icon: LocalShippingOutlinedIcon,
                title: "Standard delivery",
                description: "Deliver at normal speed.",
                recommended: true,
              },
              {
                value: "PRIORITY" as const,
                icon: BoltOutlinedIcon,
                title: "High priority",
                description: "Deliver as fast as possible.",
                recommended: false,
              },
            ]
          ).map(({ value, icon: Icon, title, description, recommended }) => {
            const active = values.deliverySpeed === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ deliverySpeed: value })}
                className={`flex h-full items-start gap-2.5 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  active
                    ? "border-(--color-brand-primary) bg-(--color-brand-primary-light)"
                    : "border-(--color-border-default) hover:border-(--color-brand-primary)"
                }`}
              >
                <span
                  className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${
                    active
                      ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                      : "bg-(--color-bg-surface-hover) text-(--color-text-secondary)"
                  }`}
                >
                  <Icon sx={{ fontSize: 17 }} />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[12.5px] font-semibold text-(--color-text-primary) whitespace-nowrap">
                      {title}
                    </span>
                    {recommended && (
                      <span className="h-5 px-2 rounded-full bg-(--color-success-light) text-[10px] font-semibold text-(--color-success-text) flex items-center">
                        Recommended
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-(--color-text-hint) mt-0.5">
                    {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
