import { useCallback } from "react";
import { apiClient } from "@/utils/apiClient";

const STORAGE_KEY = "shopkeeper_room_id";

function remembered(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** The signed-in shopkeeper's own room id, looked up once and remembered for the tab. */
export function useShopkeeperRoomId() {
  return useCallback(async (): Promise<string | null> => {
    const cached = remembered();
    if (cached) return cached;
    try {
      const { data } = await apiClient.get<{ room: { roomId: string } | null }>("/api/shop/me");
      const id = data.room?.roomId ?? null;
      if (id) sessionStorage.setItem(STORAGE_KEY, id);
      return id;
    } catch {
      return null;
    }
  }, []);
}
