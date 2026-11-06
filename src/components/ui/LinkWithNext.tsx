"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import { withNext } from "@/lib/safeRedirect";

const subscribe = () => () => {};

interface Props {
  /** Where the link goes, before any `?next=` is added. */
  path: string;
  className?: string;
  children: ReactNode;
}

/**
 * A link between the login and sign-up pages that keeps the visitor's `?next=` destination.
 * The server (and the hydrating client) do not know the address-bar query, so they render the
 * plain path; the browser then switches to the `?next=` form without a hydration mismatch.
 */
export default function LinkWithNext({ path, className, children }: Props) {
  const href = useSyncExternalStore(subscribe, () => withNext(path), () => path);
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
