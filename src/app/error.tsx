"use client";

import { useEffect } from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { reportClientError } from "@/lib/reportClientError";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportClientError("boundary", error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center bg-(--color-bg-page) px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-8 text-center">
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 40 }} className="text-(--color-danger)" />
        <h1 className="mt-3 text-xl font-bold text-(--color-text-primary)">Something went wrong</h1>
        <p className="mt-2 text-sm text-(--color-text-secondary)">
          We&apos;ve been told about it. You can try again, or come back in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 h-10 cursor-pointer rounded-xl border-0 bg-(--color-brand-primary) px-5 text-sm font-semibold text-white hover:bg-(--color-brand-primary-hover)"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
