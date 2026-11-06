"use client";

import "@/lib/zodJitless";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithPopup } from "firebase/auth";
import { z } from "zod";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { firebaseAuth, googleProvider, popupResolver } from "@/lib/firebase";
import { downloadAccountData, type ExportProof } from "@/features/account/exportApi";

const passwordSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

interface Props {
  /** POST endpoint for this role. */
  endpoint: string;
  /** What the file contains, shown before the user asks for it. */
  description: string;
  /** Google-only customer accounts have no password and confirm with a fresh Google sign-in. */
  usesGoogle?: boolean;
}

export default function ExportDataCard({ endpoint, description, usesGoogle = false }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
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

  async function download(proof: ExportProof) {
    setBusy(true);
    setError(null);
    try {
      await downloadAccountData(endpoint, proof);
      setDone(true);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't prepare your data. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmWithGoogle() {
    setBusy(true);
    setError(null);
    try {
      const { user } = await signInWithPopup(firebaseAuth, googleProvider, popupResolver);
      await download({ idToken: await user.getIdToken() });
    } catch {
      setError("Google sign-in didn't complete. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2 mb-1">
        <FileDownloadOutlinedIcon sx={{ fontSize: 20 }} className="text-(--color-brand-primary)" />
        <h2 className="text-base font-semibold text-(--color-text-primary)">Download my data</h2>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-4">{description}</p>
      {done && !open && (
        <p role="status" className="mb-3 text-sm text-(--color-success-text)">
          Your file was downloaded. Keep it somewhere safe: it contains personal information.
        </p>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setOpen(true);
          }}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-brand-primary) bg-(--color-brand-primary-light) border-0 cursor-pointer hover:opacity-90"
        >
          Download my data
        </button>
      ) : (
        <form
          onSubmit={
            usesGoogle
              ? (e) => {
                  e.preventDefault();
                  void confirmWithGoogle();
                }
              : handleSubmit((v) => download({ password: v.password }))
          }
          className="flex flex-col gap-3"
          noValidate
        >
          <p className="text-sm font-medium text-(--color-text-primary)">
            {usesGoogle ? "Confirm with Google to continue." : "Enter your password to continue."}
          </p>
          {!usesGoogle && (
            <div>
              <label htmlFor="export-password" className="sr-only">
                Password
              </label>
              <input
                id="export-password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                {...register("password")}
                className="w-full h-10 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) px-3 text-sm text-(--color-text-primary)"
              />
              {errors.password && <p className="text-sm text-(--color-danger-text) mt-1">{errors.password.message}</p>}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-active) border-0 cursor-pointer disabled:opacity-50"
            >
              {busy ? "Preparing…" : usesGoogle ? "Confirm with Google and download" : "Download"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
