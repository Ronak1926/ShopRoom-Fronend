/**
 * features/billing/invoice.ts — GST tax invoices for a shopkeeper's own payments.
 * Amounts arrive in paise, exactly as issued; this file only fetches and formats them.
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export interface Invoice {
  number: string;
  issuedOn: string;
  seller: { name: string; gstin: string; address: string };
  buyer: { name: string; address: string; state: string; gstin: string | null };
  /** GST state code of the place of supply; null when the buyer's state could not be read. */
  placeOfSupplyCode: string | null;
  /** The state that code stands for; null when the buyer's state could not be read. */
  placeOfSupplyName: string | null;
  description: string;
  sac: string;
  ratePercent: number;
  tax: { taxable: number; tax: number; cgst: number; sgst: number; igst: number; kind: "CGST_SGST" | "IGST" };
  total: number;
  razorpayPaymentId: string;
  refunded: boolean;
}

const authConfig = () => ({ headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` } });

export async function fetchInvoice(paymentId: string): Promise<Invoice> {
  const { data } = await apiClient.get<{ data: Invoice }>(`/api/shopkeeper/billing/invoices/${encodeURIComponent(paymentId)}`, authConfig());
  return data.data;
}

/** Saves the GSTIN printed on future invoices; an empty value clears it. */
export async function saveGstin(gstin: string): Promise<string> {
  const { data } = await apiClient.put<{ message: string }>("/api/shopkeeper/billing/gstin", { gstin: gstin.trim() === "" ? null : gstin.trim() }, authConfig());
  return data.message;
}
