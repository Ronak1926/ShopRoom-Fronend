/** Paise as rupees with two decimals, the way an invoice prints money: 33814 becomes ₹338.14. */
export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
