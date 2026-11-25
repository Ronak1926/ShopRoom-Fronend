"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/reportClientError";

/** Forwards uncaught errors and unhandled promise rejections to the API. Renders nothing. */
export default function ClientErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => reportClientError("error", event.error ?? event.message);
    const onRejection = (event: PromiseRejectionEvent) => reportClientError("unhandledrejection", event.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
