/**
 * features/notifications/fonts.ts — Font choices for the Text tool's Font
 * Family dropdown. Names are stored in the design JSON as plain strings (e.g.
 * "Poppins", matching the schema's `style.fontFamily`); this module only maps
 * those names to the CSS variables loaded in app/layout.tsx so they actually
 * render in the canvas, not just persist as inert data.
 */

export interface FontOption {
  /** Plain name stored in style.fontFamily. */
  value: string;
  /** Shown in the dropdown. */
  label: string;
  /** Resolved CSS font-family stack. */
  css: string;
}

export const TEXT_FONT_OPTIONS: FontOption[] = [
  { value: "Inter", label: "Inter", css: "var(--font-notif-inter), Inter, sans-serif" },
  { value: "Poppins", label: "Poppins", css: "var(--font-notif-poppins), Poppins, sans-serif" },
  { value: "Roboto", label: "Roboto", css: "var(--font-notif-roboto), Roboto, sans-serif" },
  { value: "Montserrat", label: "Montserrat", css: "var(--font-notif-montserrat), Montserrat, sans-serif" },
  { value: "Open Sans", label: "Open Sans", css: "var(--font-notif-open-sans), 'Open Sans', sans-serif" },
  { value: "Lato", label: "Lato", css: "var(--font-notif-lato), Lato, sans-serif" },
  { value: "Playfair Display", label: "Playfair Display", css: "var(--font-notif-playfair-display), 'Playfair Display', serif" },
  { value: "DM Sans", label: "DM Sans", css: "var(--font-notif-dm-sans), 'DM Sans', sans-serif" },
  { value: "Manrope", label: "Manrope", css: "var(--font-manrope), Manrope, sans-serif" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", css: "var(--font-notif-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif" },
];

const FONT_MAP: Record<string, string> = Object.fromEntries(TEXT_FONT_OPTIONS.map((f) => [f.value, f.css]));

/** Resolves a stored font name to the loaded CSS font-family stack; falls back to the raw value for legacy/custom names. */
export function resolveFontFamily(name?: string): string | undefined {
  if (!name) return undefined;
  return FONT_MAP[name] ?? `${name}, sans-serif`;
}
