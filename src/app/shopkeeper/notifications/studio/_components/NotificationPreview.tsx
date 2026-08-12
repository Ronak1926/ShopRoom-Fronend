"use client";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";

// One selection handle (small white square with a brand border).
function Handle({ className }: { className: string }) {
  return (
    <span
      className={`absolute w-2 h-2 rounded-xs bg-(--color-bg-surface) border border-(--color-brand-primary) ${className}`}
    />
  );
}

export default function NotificationPreview() {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-(--color-bg-surface) shadow-(--shadow-lg)">
      {/* Notification header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="w-7 h-7 rounded-full bg-(--color-brand-primary) flex items-center justify-center text-(--color-text-on-brand)">
          <StorefrontOutlinedIcon sx={{ fontSize: 15 }} />
        </span>
        <span className="text-[12px] font-bold tracking-wide text-(--color-text-primary)">
          YOUR SHOP
        </span>
        <span className="ml-auto text-[11px] text-(--color-text-hint)">now</span>
      </div>

      {/* Selected headline block */}
      <div className="relative mx-4 mb-4">
        {/* rotate handle */}
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-(--color-bg-surface) border border-(--color-brand-primary) flex items-center justify-center text-(--color-brand-primary)">
          <RotateRightOutlinedIcon sx={{ fontSize: 12 }} />
        </span>
        <div className="border border-(--color-brand-primary) rounded-md px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-[26px] font-extrabold text-(--color-text-primary) leading-none">
              New Arrival
            </h3>
            <CelebrationOutlinedIcon
              sx={{ fontSize: 22, color: "var(--color-brand-alert-muted)" }}
            />
          </div>
          <p className="mt-1 text-[13px] text-(--color-text-secondary)">
            Fresh collection just landed!
          </p>
        </div>
        {/* corner + edge handles */}
        <Handle className="-top-1 -left-1" />
        <Handle className="-top-1 left-1/2 -translate-x-1/2" />
        <Handle className="-top-1 -right-1" />
        <Handle className="top-1/2 -left-1 -translate-y-1/2" />
        <Handle className="top-1/2 -right-1 -translate-y-1/2" />
        <Handle className="-bottom-1 -left-1" />
        <Handle className="-bottom-1 left-1/2 -translate-x-1/2" />
        <Handle className="-bottom-1 -right-1" />
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-3">
        <span className="inline-flex items-center gap-1 h-6 px-3 rounded-full bg-(--color-brand-primary) text-(--color-text-on-brand) text-[11px] font-semibold">
          Limited Stock
          <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 13 }} />
        </span>
      </div>

      {/* Product stage */}
      <div className="relative mx-4 h-44 rounded-2xl overflow-hidden bg-linear-to-b from-(--color-brand-primary-light) via-(--color-bg-surface) to-(--color-brand-primary-muted) flex items-center justify-center">
        {/* decorative dots */}
        <span className="absolute top-4 left-5 w-1.5 h-1.5 rounded-full bg-(--color-brand-primary-muted)" />
        <span className="absolute top-10 left-9 w-1 h-1 rounded-full bg-(--color-brand-primary-muted)" />
        <span className="absolute bottom-6 right-6 w-1.5 h-1.5 rounded-full bg-(--color-brand-primary-muted)" />
        <span className="absolute top-6 right-10 w-1 h-1 rounded-full bg-(--color-brand-primary-muted)" />
        <span className="w-20 h-20 rounded-2xl bg-(--color-bg-surface) flex items-center justify-center text-(--color-brand-primary) shadow-(--shadow-md)">
          <ShoppingBagOutlinedIcon sx={{ fontSize: 40 }} />
        </span>

        {/* Stock box overlay */}
        <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2 rounded-xl bg-(--color-bg-overlay) px-3 py-2 text-(--color-text-on-brand)">
          <div className="flex items-center gap-1.5">
            <Inventory2OutlinedIcon sx={{ fontSize: 15 }} />
            <div className="leading-tight">
              <div className="text-[13px] font-bold">Only 24</div>
              <div className="text-[9px] opacity-80">Left in stock</div>
            </div>
          </div>
          <div className="text-right leading-tight">
            <div className="text-[13px] font-bold">20% OFF</div>
            <div className="text-[9px] opacity-80">Today Only</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4">
        <button
          type="button"
          className="w-full h-11 rounded-xl bg-(--color-brand-primary) text-(--color-text-on-brand) text-[14px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          Shop Now
          <ArrowForwardOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
}
