"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";

import { AuthCard } from "@/components/ui/AuthCard";
import { apiMessage } from "@/features/account/passwordApi";
import { unsubscribeFromNewsletter } from "@/features/newsletter/api";

/** The emailed link is /unsubscribe#token=…; a fragment never reaches a server or a Referer header. */
function readToken(): string | null {
  return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
}

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const NOT_READ = Symbol("not read yet");

export default function UnsubscribeCard() {
  // The server (and the hydrating client) cannot see the fragment, so they render nothing first.
  const read = useSyncExternalStore<string | null | typeof NOT_READ>(subscribeToHash, readToken, () => NOT_READ);
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (read === NOT_READ) return null;
  const token = read;

  if (!token) {
    return (
      <AuthCard title="This link doesn't work" subtitle="It may be incomplete. Use the unsubscribe link in the email we sent you.">
        <div className="flex flex-col items-center gap-5 text-center">
          <LinkOffOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-auth-ink-muted)" />
          <Link href="/contact" className="text-[13px] font-bold text-(--color-auth-primary)">
            Contact us instead
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="You're unsubscribed" subtitle="We've removed your address from the ShopRoom newsletter. You won't get any more updates from it.">
        <div className="flex flex-col items-center gap-5">
          <CheckCircleOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-success)" />
          <Link href="/" className="text-[13px] font-bold text-(--color-auth-primary)">
            Back to ShopRoom
          </Link>
        </div>
      </AuthCard>
    );
  }

  async function confirm() {
    if (!token) return;
    setWorking(true);
    setError(null);
    try {
      await unsubscribeFromNewsletter(token);
      setDone(true);
    } catch (err) {
      setError(apiMessage(err, "We couldn't unsubscribe you right now. Please try again."));
    } finally {
      setWorking(false);
    }
  }

  return (
    <AuthCard title="Unsubscribe from updates?" subtitle="You'll stop getting the ShopRoom newsletter. Your ShopRoom account, if you have one, is not affected.">
      <div className="flex flex-col gap-4">
        {error && (
          <p role="alert" className="rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={working}
          className="h-13 w-full rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active) disabled:opacity-50"
        >
          {working ? "Unsubscribing…" : "Yes, unsubscribe me"}
        </button>
        <Link href="/" className="text-center text-[13px] font-bold text-(--color-auth-ink-muted)">
          No, keep me subscribed
        </Link>
      </div>
    </AuthCard>
  );
}
