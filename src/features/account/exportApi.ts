import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import { fileNameFrom } from "./fileName";

export type ExportProof = { password: string } | { idToken: string };

/** An error response to a file request arrives as a Blob; the server's message is JSON inside it. */
async function messageFromFailure(err: unknown): Promise<string> {
  const response = (err as { response?: { status?: number; data?: unknown } }).response;
  if (response?.status === 403) return "We couldn't confirm it's you. Check your details and try again.";
  if (response?.status === 429) return "You've downloaded your data several times already. Please try again later.";
  try {
    const body = response?.data instanceof Blob ? JSON.parse(await response.data.text()) : response?.data;
    const message = (body as { message?: unknown } | null)?.message;
    if (typeof message === "string" && message) return message;
  } catch {
    // Not JSON: fall through to the generic text.
  }
  return "Couldn't prepare your data. Please try again.";
}

/** Asks for the account's data (proving identity again) and saves it as a file in the browser. */
export async function downloadAccountData(endpoint: string, cookieName: "token" | "shopkeeper_token", proof: ExportProof): Promise<void> {
  let response;
  try {
    response = await apiClient.post<Blob>(endpoint, proof, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${getCookie(cookieName)}` },
    });
  } catch (err) {
    throw new Error(await messageFromFailure(err));
  }
  const name = fileNameFrom(response.headers["content-disposition"] as string | undefined, "shoproom-data.json");
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
