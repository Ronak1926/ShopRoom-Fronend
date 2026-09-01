"use client";

import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import StepCard from "./StepCard";
import type { ShopAudience } from "@/hooks/useShopAudience";
import {
  AUDIENCE_OPTIONS,
  MAX_RADIUS_KM,
  MIN_RADIUS_KM,
  RADIUS_PRESETS_KM,
  usesRadius,
  type AudienceMode,
} from "../_schemas/sendNotification";

interface Props {
  mode: AudienceMode;
  onModeChange: (mode: AudienceMode) => void;
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  shop: ShopAudience | null;
}

export default function AudienceStep({
  mode,
  onModeChange,
  radiusKm,
  onRadiusChange,
  shop,
}: Props) {
  // Radius targeting measures from the shop's coordinates, so without them the
  // two nearby modes cannot be honoured — say so rather than sending nowhere.
  const canTargetByRadius = !shop || shop.hasCoordinates;
  const showRadius = usesRadius(mode);

  return (
    <StepCard step={2} title="Audience">
      <div className="mt-4">
        <h3 className="text-[12.5px] font-semibold text-(--color-text-primary)">Send to</h3>
        <p className="text-[11px] text-(--color-text-hint) mt-0.5">
          Choose who will receive this notification.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {AUDIENCE_OPTIONS.map((option) => {
          const disabled = usesRadius(option.value) && !canTargetByRadius;
          const active = mode === option.value;
          return (
            <label
              key={option.value}
              title={disabled ? "Add your shop location in Profile first" : undefined}
              className={`flex gap-2.5 p-3 rounded-xl border transition-colors ${
                disabled
                  ? "border-(--color-border-default) opacity-50 cursor-not-allowed"
                  : active
                    ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) cursor-pointer"
                    : "border-(--color-border-default) hover:border-(--color-brand-primary) cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="send-audience"
                value={option.value}
                checked={active}
                disabled={disabled}
                onChange={() => onModeChange(option.value)}
                className="mt-0.5 w-3.5 h-3.5 shrink-0 accent-(--color-brand-primary) cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-(--color-text-primary)">
                  {option.label}
                </span>
                <span className="block text-[11px] text-(--color-text-hint) mt-0.5 leading-snug">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}

        <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-(--color-brand-primary-light)">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-(--color-brand-primary)">
            Audience
          </span>
          {showRadius ? (
            <>
              <MyLocationOutlinedIcon
                sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
              />
              <span className="text-[22px] font-bold leading-none text-(--color-text-primary)">
                {radiusKm} km
              </span>
              <span className="text-[10.5px] text-(--color-text-secondary) text-center">
                counted at send time
              </span>
            </>
          ) : (
            <>
              <PeopleOutlineOutlinedIcon
                sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
              />
              <span className="text-[22px] font-bold leading-none text-(--color-text-primary)">
                {shop ? shop.membersCount.toLocaleString() : "—"}
              </span>
              <span className="text-[10.5px] text-(--color-text-secondary)">Members</span>
            </>
          )}
        </div>
      </div>

      {showRadius && (
        <div className="mt-3 rounded-xl border border-(--color-border-default) bg-(--color-bg-page) p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[12.5px] font-semibold text-(--color-text-primary)">
                Radius from your shop
              </h3>
              <p className="flex items-center gap-1 text-[11px] text-(--color-text-hint) mt-0.5">
                <PlaceOutlinedIcon sx={{ fontSize: 13 }} />
                <span className="truncate">
                  {shop?.place ? `Measured from ${shop.place}` : "Measured from your shop address"}
                </span>
              </p>
            </div>
            <span className="shrink-0 text-[18px] font-bold text-(--color-brand-primary) tabular-nums">
              {radiusKm} km
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="range"
              aria-label="Radius in kilometres"
              min={MIN_RADIUS_KM}
              max={MAX_RADIUS_KM}
              step={1}
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="flex-1 min-w-40 accent-(--color-brand-primary) cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              {RADIUS_PRESETS_KM.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => onRadiusChange(km)}
                  className={`h-8 px-2.5 rounded-lg border text-[11.5px] font-semibold transition-colors cursor-pointer ${
                    radiusKm === km
                      ? "border-(--color-brand-primary) bg-(--color-brand-primary) text-(--color-text-on-brand)"
                      : "border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary)"
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-(--color-text-secondary)">
            Everyone whose current location is inside this circle receives the notification —
            {mode === "NEARBY"
              ? " including people who have not joined your room."
              : " limited to people who have joined your room."}
          </p>
        </div>
      )}

      {!canTargetByRadius && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-(--color-brand-alert-light) px-3 py-2.5 text-[11.5px] leading-relaxed text-(--color-text-secondary)">
          <WarningAmberOutlinedIcon
            sx={{ fontSize: 15, color: "var(--color-brand-alert)" }}
            className="mt-0.5 shrink-0"
          />
          Your shop has no saved location, so radius targeting is unavailable. Add it under
          Profile to reach customers near the shop.
        </p>
      )}
    </StepCard>
  );
}
