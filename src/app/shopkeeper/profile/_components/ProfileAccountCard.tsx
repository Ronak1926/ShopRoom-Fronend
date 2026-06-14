"use client";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

interface Props {
  id: string;
  email: string;
  createdAt: string;
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfileAccountCard({ id, email, createdAt }: Props) {
  const truncatedId = id.length > 16 ? `${id.slice(0, 16)}…` : id;

  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-[16px] font-bold text-(--color-text-primary)">
        Account
      </h3>

      {/* Email */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
          <EmailOutlinedIcon
            sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
          />
        </div>
        <div>
          <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
            Email address
          </p>
          <p className="text-[14px] font-medium text-(--color-text-primary)">
            {email}
          </p>
        </div>
      </div>

      {/* Account created */}
      <div className="flex items-center justify-between py-3 border-t border-(--color-border-default)">
        <span className="text-[13px] text-(--color-text-secondary)">
          Account created
        </span>
        <span
          className="text-[13px] font-medium text-(--color-text-primary)"
          suppressHydrationWarning
        >
          {formatFullDate(createdAt)}
        </span>
      </div>

      {/* Account ID */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-(--color-text-secondary)">
          Account ID
        </span>
        <span className="font-mono text-[12px] bg-(--color-bg-page) border border-(--color-border-default) rounded-md px-2 py-0.5 text-(--color-text-hint) select-all">
          {truncatedId}
        </span>
      </div>
    </div>
  );
}
