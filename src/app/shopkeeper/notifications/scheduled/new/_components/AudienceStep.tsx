"use client";

import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import type { ElementType } from "react";
import type { ShopAudience } from "@/hooks/useShopAudience";
import { MAX_RADIUS_KM, MIN_RADIUS_KM, RADIUS_PRESETS_KM } from "../../_schemas/schedule";

interface Props {
  includeMembers: boolean;
  includeNearby: boolean;
  radiusKm: number;
  includeFutureMembers: boolean;
  skipNotificationsOff: boolean;
  shop: ShopAudience | null;
  onChange: (patch: {
    includeMembers?: boolean;
    includeNearby?: boolean;
    radiusKm?: number;
    includeFutureMembers?: boolean;
    skipNotificationsOff?: boolean;
  }) => void;
  fieldError?: string;
}

function AudienceCard({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  disabledHint,
  onToggle,
}: {
  icon: ElementType;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  disabledHint?: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      title={disabled ? disabledHint : undefined}
      onClick={onToggle}
      className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-colors ${
        disabled
          ? "border-(--color-border-default) opacity-50 cursor-not-allowed"
          : checked
            ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) cursor-pointer"
            : "border-(--color-border-default) hover:border-(--color-brand-primary) cursor-pointer"
      }`}
    >
      <span
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          checked
            ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
            : "bg-(--color-bg-surface-hover) text-(--color-text-secondary)"
        }`}
      >
        <Icon sx={{ fontSize: 19 }} />
      </span>
      <span className="text-[13px] font-semibold text-(--color-text-primary)">{title}</span>
      <span className="text-[11.5px] leading-snug text-(--color-text-hint)">{description}</span>

      {checked && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-(--color-brand-primary) text-(--color-text-on-brand) flex items-center justify-center">
          <CheckOutlinedIcon sx={{ fontSize: 13 }} />
        </span>
      )}
    </button>
  );
}

function OptionRow({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: ElementType;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 py-3 border-b border-(--color-border-default) last:border-b-0 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 shrink-0 accent-(--color-brand-primary) cursor-pointer"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold text-(--color-text-primary)">
          {title}
        </span>
        <span className="block text-[11px] text-(--color-text-hint) mt-0.5">{description}</span>
      </span>
      <span className="w-9 h-9 shrink-0 rounded-lg bg-(--color-bg-surface-hover) text-(--color-text-secondary) flex items-center justify-center">
        <Icon sx={{ fontSize: 17 }} />
      </span>
    </label>
  );
}

/**
 * Step 2 — who receives it.
 *
 * The two legs are OR'd: room members, plus anyone inside the radius. Someone
 * who is both still receives one notification.
 */
export default function AudienceStep({
  includeMembers,
  includeNearby,
  radiusKm,
  includeFutureMembers,
  skipNotificationsOff,
  shop,
  onChange,
  fieldError,
}: Props) {
  const canTargetByRadius = !shop || shop.hasCoordinates;

  return (
    <div>
      <h3 className="text-[12.5px] font-semibold text-(--color-text-primary)">Audience</h3>
      <p className="text-[11px] text-(--color-text-hint) mt-0.5">
        Pick one or both. Anyone in both groups is counted — and notified — once.
      </p>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AudienceCard
          icon={PeopleOutlineOutlinedIcon}
          title="Room members"
          description="Everyone who joined your room, wherever they are."
          checked={includeMembers}
          onToggle={() => onChange({ includeMembers: !includeMembers })}
        />
        <AudienceCard
          icon={MyLocationOutlinedIcon}
          title={`People within ${radiusKm} km`}
          description="Anyone sharing their location near the shop, member or not."
          checked={includeNearby}
          disabled={!canTargetByRadius}
          disabledHint="Add your shop location in Profile first"
          onToggle={() => onChange({ includeNearby: !includeNearby })}
        />
      </div>

      {fieldError && <p className="mt-2 text-[11.5px] text-(--color-danger)">{fieldError}</p>}

      {includeNearby && canTargetByRadius && (
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
              onChange={(e) => onChange({ radiusKm: Number(e.target.value) })}
              className="flex-1 min-w-40 accent-(--color-brand-primary) cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              {RADIUS_PRESETS_KM.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => onChange({ radiusKm: km })}
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

      <h3 className="mt-5 text-[12.5px] font-semibold text-(--color-text-primary)">
        Additional options
      </h3>
      <div className="mt-1">
        <OptionRow
          icon={PersonAddAltOutlinedIcon}
          title="Include members who join before it sends"
          description="The audience is resolved at send time, not now."
          checked={includeFutureMembers}
          onToggle={() => onChange({ includeFutureMembers: !includeFutureMembers })}
        />
        <OptionRow
          icon={NotificationsOffOutlinedIcon}
          title="Skip members with notifications off"
          description="Respects the per-room switch each member controls."
          checked={skipNotificationsOff}
          onToggle={() => onChange({ skipNotificationsOff: !skipNotificationsOff })}
        />
      </div>

      <div className="mt-5 rounded-xl bg-(--color-brand-primary-light) px-4 py-3.5">
        <h3 className="text-[12px] font-semibold text-(--color-brand-primary)">
          Audience estimate
        </h3>
        <p className="mt-1 text-[22px] font-bold leading-none text-(--color-text-primary) tabular-nums">
          {includeMembers && shop ? shop.membersCount.toLocaleString() : "—"}
          {includeNearby && (
            <span className="ml-2 text-[12px] font-medium text-(--color-text-secondary)">
              + people within {radiusKm} km
            </span>
          )}
        </p>
        <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-(--color-text-secondary)">
          <InfoOutlinedIcon sx={{ fontSize: 13 }} className="mt-0.5 shrink-0" />
          {includeNearby
            ? "Members are known now; how many people are near the shop is counted when it sends."
            : "Everyone who has joined your room."}
        </p>
      </div>
    </div>
  );
}
