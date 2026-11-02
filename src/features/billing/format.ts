const DATE_FORMAT: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", DATE_FORMAT);
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
