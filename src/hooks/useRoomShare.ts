"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

let cached: { token: string; link: Promise<string | null> } | null = null;

/** The shop's invite link, looked up once per sign-in and shared by every page that offers it. */
function loadInviteLink(token: string): Promise<string | null> {
  if (cached?.token === token) return cached.link;
  const link = apiClient
    .get<{ room: { inviteLink: string } | null }>("/api/shop/me")
    .then((res) => res.data.room?.inviteLink ?? null)
    .catch(() => {
      cached = null;
      return null;
    });
  cached = { token, link };
  return link;
}

/** Share-room state for pages that do not already know the invite link. */
export function useRoomShare() {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = getCookie("shopkeeper_token");
    if (!token) return;
    let cancelled = false;
    loadInviteLink(token).then((link) => !cancelled && setInviteLink(link));
    return () => {
      cancelled = true;
    };
  }, []);

  const openShare = useCallback(() => setOpen(true), []);
  const closeShare = useCallback(() => setOpen(false), []);
  return { inviteLink, open, openShare, closeShare };
}
