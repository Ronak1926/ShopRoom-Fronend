"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const STEPS = [
  {
    icon: CollectionsBookmarkOutlinedIcon,
    title: "Pick a design",
    body: "Anything you saved in the Studio, plus templates you favourited.",
  },
  {
    icon: MyLocationOutlinedIcon,
    title: "Choose who gets it",
    body: "Your room members, or everyone standing within a few kilometres of the shop.",
  },
  {
    icon: ChatBubbleOutlineOutlinedIcon,
    title: "Add a message",
    body: "One optional line, drawn under the banner on the phone.",
  },
];

export default function HowItWorksCard({ onClose }: { onClose: () => void }) {
  return (
    <section className="relative rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <button
        type="button"
        onClick={onClose}
        title="Hide"
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
      >
        <CloseOutlinedIcon sx={{ fontSize: 16 }} />
      </button>

      <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">How it works</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-2.5">
            <span className="w-8 h-8 shrink-0 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
              <Icon sx={{ fontSize: 16 }} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold text-(--color-text-primary)">
                {title}
              </span>
              <span className="block text-[11px] leading-snug text-(--color-text-hint) mt-0.5">
                {body}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
