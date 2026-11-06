"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import Avatar from "@/components/ui/Avatar";
import { apiClient } from "@/utils/apiClient";
import { useAuthSession } from "@/hooks/useAuthSession";
import { deleteCookie } from "@/utils/cookieUtils";

interface InvitePreview {
  shop: { shopName: string; category: string; description: string | null; logoUrl: string | null; address: string; city: string };
  membersCount: number;
}

type Load = { kind: "loading" } | { kind: "ready"; preview: InvitePreview } | { kind: "invalid" } | { kind: "error" };

function apiMessage(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-(--color-bg-page) px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2 text-(--color-auth-ink)">
          <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={24} height={21} />
          <span className="text-[24px] leading-8 tracking-[-1.2px] font-bold">ShopRoom</span>
        </div>
        <div className="rounded-[14px] border border-(--color-border-default) bg-(--color-bg-surface) p-6 shadow-(--shadow-md) sm:p-8">{children}</div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <Shell>
      <div className="flex animate-pulse flex-col items-center gap-3" aria-busy="true" aria-label="Loading invite">
        <div className="h-16 w-16 rounded-full bg-(--color-bg-surface-hover)" />
        <div className="h-6 w-48 rounded bg-(--color-bg-surface-hover)" />
        <div className="h-4 w-32 rounded bg-(--color-bg-surface-hover)" />
        <div className="mt-4 h-12 w-full rounded-lg bg-(--color-bg-surface-hover)" />
      </div>
    </Shell>
  );
}

export default function JoinInvite({ code }: { code: string }) {
  const router = useRouter();
  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const cookieSession = useAuthSession();
  const [sessionEnded, setSessionEnded] = useState(false);
  const session = sessionEnded ? "none" : cookieSession;
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<InvitePreview>(`/api/shop/invite/${encodeURIComponent(code)}`)
      .then((res) => !cancelled && setLoad({ kind: "ready", preview: res.data }))
      .catch((err: { response?: { status?: number } }) => !cancelled && setLoad({ kind: err?.response?.status === 404 ? "invalid" : "error" }));
    return () => {
      cancelled = true;
    };
  }, [code]);

  async function join() {
    setJoining(true);
    setJoinError(null);
    try {
      const { data } = await apiClient.post<{ roomId: string }>(`/api/shop/join/${encodeURIComponent(code)}`, {});
      router.replace(`/customer/room/${data.roomId}`);
    } catch (err) {
      if ((err as { response?: { status?: number } })?.response?.status === 401) {
        deleteCookie("token");
        setSessionEnded(true);
        setJoinError("Your session has ended. Please log in again to join.");
      } else {
        setJoinError(apiMessage(err, "Could not join this room. Please try again."));
      }
      setJoining(false);
    }
  }

  if (load.kind === "loading" || session === null) return <Skeleton />;

  if (load.kind !== "ready") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 text-center">
          <LinkOffOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-auth-ink-muted)" />
          <h1 className="text-[20px] font-extrabold text-(--color-auth-ink)">
            {load.kind === "invalid" ? "This invite link doesn't work" : "We couldn't open this invite"}
          </h1>
          <p className="text-[14px] text-(--color-auth-ink-muted)">
            {load.kind === "invalid" ? "It may have been mistyped or is no longer valid. Ask the shop for a fresh link." : "Please check your connection and try again."}
          </p>
          <Link href="/" className="text-[13px] font-bold text-(--color-auth-primary)">
            Go to ShopRoom
          </Link>
        </div>
      </Shell>
    );
  }

  const { shop, membersCount } = load.preview;
  const next = encodeURIComponent(`/join/${code}`);

  return (
    <Shell>
      <div className="flex flex-col items-center text-center">
        <Avatar name={shop.shopName} src={shop.logoUrl} size="lg" />
        <p className="mt-4 text-[13px] text-(--color-auth-ink-muted)">You&apos;ve been invited to join</p>
        <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.5px] text-(--color-auth-ink)">{shop.shopName}</h1>
        <p className="mt-1 text-[13px] font-semibold text-(--color-auth-primary)">{shop.category}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-(--color-auth-ink-muted)">
          <span className="flex items-center gap-1">
            <PeopleOutlinedIcon sx={{ fontSize: 16 }} />
            {membersCount.toLocaleString()} {membersCount === 1 ? "member" : "members"}
          </span>
          <span className="flex items-center gap-1">
            <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
            {shop.address}, {shop.city}
          </span>
        </div>
        {shop.description && <p className="mt-4 text-[14px] leading-relaxed text-(--color-auth-ink-muted)">{shop.description}</p>}
      </div>

      <div className="mt-7 flex flex-col gap-3">
        {joinError && (
          <p role="alert" className="rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
            {joinError}
          </p>
        )}

        {session === "customer" && (
          <button
            type="button"
            onClick={() => void join()}
            disabled={joining}
            className="h-13 w-full rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active) disabled:opacity-60"
          >
            {joining ? "Joining…" : "Join room"}
          </button>
        )}

        {session === "none" && (
          <>
            <Link
              href={`/customer/login?next=${next}`}
              className="flex h-13 w-full items-center justify-center rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active)"
            >
              Log in to join
            </Link>
            <Link
              href={`/customer/signup?next=${next}`}
              className="flex h-13 w-full items-center justify-center rounded-lg border border-(--color-border-default) text-[15px] font-bold text-(--color-auth-ink) transition-colors hover:bg-(--color-bg-surface-hover)"
            >
              Create an account
            </Link>
          </>
        )}

        {session === "shopkeeper" && (
          <p className="rounded-lg bg-(--color-brand-alert-light) px-3 py-2.5 text-center text-[13px] text-(--color-brand-alert-text)">
            You&apos;re signed in as a shopkeeper. Open this link while signed in with a customer account to join.
          </p>
        )}
      </div>
    </Shell>
  );
}
