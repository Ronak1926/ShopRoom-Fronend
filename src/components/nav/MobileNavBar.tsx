"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

/**
 * The phone-width replacement for a sidebar: a slim top bar with a menu button
 * that opens the same navigation in a drawer. Hidden from the `lg` breakpoint up,
 * where the sidebar itself is shown.
 */
export default function MobileNavBar({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  const pathname = usePathname();
  // Remembering the path it was opened on means following a link (or the back button) closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-(--color-border-default) bg-(--color-bg-surface) px-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-(--color-text-primary) hover:bg-(--color-bg-surface-hover)"
        >
          <MenuOutlinedIcon />
        </button>
        <Image src="/ShopRoomIcon.svg" alt="" width={20} height={18} />
        <span className="text-[17px] font-bold text-(--color-text-primary)">ShopRoom</span>
        {actions && <div className="ml-auto flex items-center">{actions}</div>}
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative flex h-full w-64 max-w-[85vw] flex-col overflow-y-auto bg-(--color-bg-surface) shadow-xl">
            <div className="flex h-14 shrink-0 items-center justify-between px-4">
              <span className="text-[17px] font-bold text-(--color-text-primary)">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
              >
                <CloseOutlinedIcon fontSize="small" />
              </button>
            </div>
            <div className="flex flex-1 flex-col pb-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
