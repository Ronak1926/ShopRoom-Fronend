import { apiClient } from "@/utils/apiClient";

/** The token comes from the unsubscribe link in a newsletter email. Safe to repeat: leaving twice is the same as once. */
export async function unsubscribeFromNewsletter(token: string): Promise<string> {
  const { data } = await apiClient.post<{ message: string }>("/api/public/newsletter/unsubscribe", { token });
  return data.message;
}
