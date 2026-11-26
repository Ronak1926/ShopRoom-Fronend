/**
 * Public support details shown on the Contact page. Each one appears only when its env value is
 * set, so the page never shows a placeholder.
 */
function read(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const SUPPORT_CONTACT = {
  email: read(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
  phone: read(process.env.NEXT_PUBLIC_SUPPORT_PHONE),
  address: read(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS),
  hours: read(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
};
