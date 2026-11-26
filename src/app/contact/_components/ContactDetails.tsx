import type { ReactNode } from "react";
import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { SUPPORT_CONTACT } from "@/lib/supportContact";

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary)">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">{label}</p>
        <div className="mt-0.5 break-words text-[14px] font-medium text-(--color-text-primary)">{children}</div>
      </div>
    </li>
  );
}

export default function ContactDetails() {
  const { email, phone, address, hours } = SUPPORT_CONTACT;
  const hasDetails = !!(email || phone || address || hours);

  return (
    <aside className="flex flex-col gap-4">
      <Link
        href="/help"
        className="group flex items-center gap-3 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 transition-colors hover:border-(--color-brand-primary)"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary)">
          <HelpOutlineOutlinedIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-(--color-text-primary)">Check the Help Center first</span>
          <span className="block text-[13px] text-(--color-text-secondary)">Most questions are answered there in seconds.</span>
        </span>
        <ArrowForwardOutlinedIcon fontSize="small" className="text-(--color-text-secondary) transition-transform group-hover:translate-x-0.5" />
      </Link>

      {hasDetails && (
        <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
          <h2 className="text-[15px] font-bold text-(--color-text-primary)">Reach us directly</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {email && (
              <DetailRow icon={<EmailOutlinedIcon fontSize="small" />} label="Email">
                <a href={`mailto:${email}`} className="text-(--color-text-link) hover:underline">
                  {email}
                </a>
              </DetailRow>
            )}
            {phone && (
              <DetailRow icon={<LocalPhoneOutlinedIcon fontSize="small" />} label="Phone">
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-(--color-text-link) hover:underline">
                  {phone}
                </a>
              </DetailRow>
            )}
            {hours && (
              <DetailRow icon={<ScheduleOutlinedIcon fontSize="small" />} label="Support hours">
                {hours}
              </DetailRow>
            )}
            {address && (
              <DetailRow icon={<LocationOnOutlinedIcon fontSize="small" />} label="Business address">
                <span className="whitespace-pre-line">{address}</span>
              </DetailRow>
            )}
          </ul>
        </div>
      )}

      <div className="rounded-2xl bg-(--color-brand-primary-light) p-5">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Helpful to include</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-(--color-text-secondary)">
          <li>The email you signed up with</li>
          <li>The shop name, if it is about a shop</li>
          <li>For a payment issue, the Razorpay payment ID from your receipt</li>
          <li>What you expected and what happened instead</li>
        </ul>
      </div>
    </aside>
  );
}
