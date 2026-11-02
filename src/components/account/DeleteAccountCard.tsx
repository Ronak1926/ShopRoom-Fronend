"use client";

import "@/lib/zodJitless";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithPopup } from "firebase/auth";
import { z } from "zod";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { firebaseAuth, googleProvider } from "@/lib/firebase";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { deleteCookie, getCookie } from "@/utils/cookieUtils";

const passwordSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

interface Props {
  /** Cookie holding this role's session token. */
  cookieName: "token" | "shopkeeper_token";
  /** DELETE endpoint for this role. */
  endpoint: string;
  /** What the deletion removes, shown before the user confirms. */
  consequences: string;
  /** Google-only customer accounts have no password and confirm with a fresh Google sign-in. */
  usesGoogle?: boolean;
}

function errorMessage(err: unknown): string {
  const response = (err as { response?: { data?: { message?: string }; status?: number } }).response;
  if (response?.status === 403) return "We couldn't confirm it's you. Check your details and try again.";
  return response?.data?.message ?? "Couldn't delete the account. Please try again.";
}

export default function DeleteAccountCard({ cookieName, endpoint, consequences, usesGoogle = false }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  function close() {
    setOpen(false);
    setError(null);
    reset();
  }

  async function deleteAccount(body: { password: string } | { idToken: string }) {
    setBusy(true);
    setError(null);
    try {
      await apiClient.delete(endpoint, {
        data: body,
        headers: { Authorization: `Bearer ${getCookie(cookieName)}` },
      });
      deleteCookie(cookieName);
      setAuthToken(null);
      router.replace("/");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  async function confirmWithGoogle() {
    setBusy(true);
    setError(null);
    try {
      const { user } = await signInWithPopup(firebaseAuth, googleProvider);
      await deleteAccount({ idToken: await user.getIdToken() });
    } catch {
      setError("Google sign-in didn't complete. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-(--color-danger-bg) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2 mb-1">
        <DeleteForeverOutlinedIcon sx={{ fontSize: 20 }} className="text-(--color-danger)" />
        <h2 className="text-base font-semibold text-(--color-text-primary)">Delete account</h2>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-4">{consequences}</p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-danger) bg-(--color-danger-light) border-0 cursor-pointer hover:opacity-90"
        >
          Delete my account
        </button>
      ) : (
        <form
          onSubmit={usesGoogle ? (e) => { e.preventDefault(); void confirmWithGoogle(); } : handleSubmit((v) => deleteAccount({ password: v.password }))}
          className="flex flex-col gap-3"
          noValidate
        >
          <p className="text-sm font-medium text-(--color-danger-text)">
            This can&apos;t be undone.{" "}
            {usesGoogle ? "Confirm with Google to continue." : "Enter your password to continue."}
          </p>
          {!usesGoogle && (
            <div>
              <label htmlFor="delete-password" className="sr-only">
                Password
              </label>
              <input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                {...register("password")}
                className="w-full h-10 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) px-3 text-sm text-(--color-text-primary)"
              />
              {errors.password && (
                <p className="text-sm text-(--color-danger-text) mt-1">{errors.password.message}</p>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-(--color-danger-text)">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={close}
              disabled={busy}
              className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-text-secondary) bg-(--color-bg-surface) border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-surface-hover) disabled:opacity-50"
            >
              Keep my account
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white bg-(--color-danger) hover:bg-(--color-danger-hover) border-0 cursor-pointer disabled:opacity-50"
            >
              {busy ? "Deleting..." : usesGoogle ? "Confirm with Google and delete" : "Delete permanently"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
