import Link from "next/link";

interface Props {
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export function AuthTabButton({ active, children, onClick, href }: Props) {
  const cls = `flex-1 text-center text-[13px] py-2 rounded-lg transition font-[inherit] ${
    active
      ? "font-semibold bg-(--color-bg-surface) text-(--color-auth-primary) shadow-sm"
      : "font-medium text-(--color-auth-ink-muted) hover:text-(--color-auth-ink)"
  }`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
