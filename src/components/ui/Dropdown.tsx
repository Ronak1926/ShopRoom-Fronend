"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

export interface DropdownOption<T extends string | number> {
  value: T;
  label: string;
  /** Optional second line, e.g. an offset under a time zone name. */
  hint?: string;
  disabled?: boolean;
}

interface Props<T extends string | number> {
  id?: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  /** Falls back to the trigger's own label for screen readers. */
  ariaLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Tailwind width utility for the trigger. */
  className?: string;
}

/**
 * Themed replacement for a native `<select>`.
 *
 * A native select renders its list with the operating system, so it ignores the
 * app's tokens entirely — the popup is a different typeface, different colours
 * and different metrics on every platform. This keeps the same keyboard and
 * screen-reader behaviour while drawing the list ourselves.
 *
 * Positioned absolutely rather than in a portal, so it needs no repositioning
 * logic while the page scrolls; it flips above the trigger when there is not
 * enough room below. Ancestors must therefore not clip overflow.
 */
export default function Dropdown<T extends string | number>({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "Select…",
  disabled,
  className = "min-w-44",
}: Props<T>) {
  const generatedId = useId();
  const listId = `${id ?? generatedId}-listbox`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [flip, setFlip] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", at: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) rootRef.current?.querySelector("button")?.focus();
  }, []);

  // Open below unless the trigger is close to the bottom of the window.
  const openList = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    const estimated = Math.min(options.length, 7) * 36 + 8;
    setFlip(!!rect && rect.bottom + estimated > window.innerHeight && rect.top > estimated);
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [options.length, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // Capture so it still closes when the click lands on another control.
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelectorAll("li")[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    close();
  };

  const step = (delta: number) => {
    if (!options.length) return;
    let next = active;
    for (let i = 0; i < options.length; i++) {
      next = (next + delta + options.length) % options.length;
      if (!options[next].disabled) break;
    }
    setActive(next);
  };

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); step(1); break;
      case "ArrowUp": e.preventDefault(); step(-1); break;
      case "Home": e.preventDefault(); setActive(0); break;
      case "End": e.preventDefault(); setActive(options.length - 1); break;
      case "Enter":
      case " ": e.preventDefault(); commit(active); break;
      case "Escape": e.preventDefault(); close(); break;
      case "Tab": setOpen(false); break;
      default: {
        // Type-ahead: letters typed in quick succession jump to a match, the
        // way a native select behaves.
        if (e.key.length !== 1) return;
        const now = Date.now();
        const state = typeahead.current;
        state.text = now - state.at > 600 ? e.key : state.text + e.key;
        state.at = now;
        const match = options.findIndex(
          (o) => !o.disabled && o.label.toLowerCase().startsWith(state.text.toLowerCase()),
        );
        if (match >= 0) setActive(match);
      }
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onKeyDown}
        className={`w-full h-9 pl-3 pr-2 flex items-center justify-between gap-2 rounded-lg border bg-(--color-bg-surface) text-[12.5px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          open
            ? "border-(--color-brand-primary)"
            : "border-(--color-border-default) hover:border-(--color-border-strong)"
        }`}
      >
        <span className={`truncate ${selected ? "text-(--color-text-primary)" : "text-(--color-text-hint)"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ExpandMoreOutlinedIcon
          sx={{ fontSize: 17, color: "var(--color-text-hint)" }}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute z-30 w-full max-h-64 overflow-y-auto py-1 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) shadow-(--shadow-lg) ${
            flip ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={String(o.value)}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled}
                onPointerEnter={() => !o.disabled && setActive(i)}
                onClick={() => commit(i)}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 text-[12.5px] transition-colors ${
                  o.disabled
                    ? "text-(--color-text-disabled) cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  !o.disabled && i === active ? "bg-(--color-brand-primary-light)" : ""
                } ${isSelected ? "font-semibold text-(--color-brand-primary)" : "text-(--color-text-primary)"}`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{o.label}</span>
                  {o.hint && (
                    <span className="block text-[10.5px] text-(--color-text-hint) truncate">{o.hint}</span>
                  )}
                </span>
                {isSelected && <CheckOutlinedIcon sx={{ fontSize: 15 }} className="shrink-0" />}
              </li>
            );
          })}
          {!options.length && (
            <li className="px-3 py-2 text-[12px] text-(--color-text-hint)">No options</li>
          )}
        </ul>
      )}
    </div>
  );
}
