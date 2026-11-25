import Link from "next/link";
import type { ElementType } from "react";

interface NavItemProps {
  href: string;
  label: string;
  Icon: ElementType;
  active: boolean;
  /** Icon-only rail: the label moves into a tooltip. */
  collapsed?: boolean;
}

const BASE = "relative flex w-full items-center rounded-xl py-2.5 text-left text-[14px] transition-colors duration-150 select-none";
const ACTIVE = "bg-(--color-brand-primary-light) font-semibold text-(--color-brand-primary)";
const IDLE = "text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary)";

export function navItemClass(active: boolean, collapsed: boolean): string {
  return `${BASE} ${collapsed ? "justify-center px-0" : "gap-3 px-3"} ${active ? ACTIVE : IDLE}`;
}

export function ActiveBar() {
  return <span className="absolute top-2.5 bottom-2.5 left-0 w-0.75 rounded-full bg-(--color-brand-primary)" />;
}

export default function NavItem({ href, label, Icon, active, collapsed = false }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={navItemClass(active, collapsed)}
    >
      {active && <ActiveBar />}
      <Icon sx={{ fontSize: 18 }} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
