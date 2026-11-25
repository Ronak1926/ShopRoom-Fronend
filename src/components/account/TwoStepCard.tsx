"use client";

import { useCallback, useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { firebaseAuth, googleProvider, popupResolver } from "@/lib/firebase";
import { groupSecret } from "@/features/account/groupSecret";
import {
  confirmMfaSetup,
  fetchMfaStatus,
  replaceRecoveryCodes,
  startMfaSetup,
  turnOffMfa,
  type MfaProof,
  type MfaRole,
  type MfaSetup,
  type MfaStatus,
} from "@/features/account/mfaApi";
import ProofForm from "./ProofForm";
import RecoveryCodesPanel from "./RecoveryCodesPanel";

type Step = "idle" | "proof" | "scan" | "turn-off" | "new-codes";

interface Props {
  role: MfaRole;
  /** Google-only customers have no password and confirm with a fresh Google sign-in. */
  usesGoogle?: boolean;
}

function failureMessage(err: unknown): string {
  const response = (err as { response?: { status?: number; data?: { message?: string } } }).response;
  if (response?.status === 403) return "That didn't match. Check your password or code and try again.";
  if (response?.status === 429) return "Too many attempts. Please wait a few minutes.";
  return response?.data?.message ?? "Something went wrong. Please try again.";
}

export default function TwoStepCard({ role, usesGoogle = false }: Props) {
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [setup, setSetup] = useState<MfaSetup | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetchMfaStatus(role)
      .then((s) => {
        setStatus(s);
        setLoadFailed(false);
      })
      .catch(() => setLoadFailed(true));
  }, [role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function cancel() {
    setStep("idle");
    setSetup(null);
    setError(null);
  }

  /** The password, or (Google-only customers) a fresh Google sign-in. */
  async function proofFor(password: string): Promise<MfaProof> {
    if (!usesGoogle) return { password };
    const { user } = await signInWithPopup(firebaseAuth, googleProvider, popupResolver);
    return { idToken: await user.getIdToken() };
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(failureMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const begin = ({ password }: { password: string }) =>
    run(async () => {
      setSetup(await startMfaSetup(role, await proofFor(password)));
      setStep("scan");
    });

  const confirm = ({ code }: { code: string }) =>
    run(async () => {
      setCodes(await confirmMfaSetup(role, code));
      cancel();
      refresh();
    });

  const turnOff = ({ password, code }: { password: string; code: string }) =>
    run(async () => {
      await turnOffMfa(role, await proofFor(password), code);
      cancel();
      refresh();
    });

  const newCodes = ({ password, code }: { password: string; code: string }) =>
    run(async () => {
      setCodes(await replaceRecoveryCodes(role, await proofFor(password), code));
      cancel();
      refresh();
    });

  let body;
  if (codes) {
    body = <RecoveryCodesPanel codes={codes} onDone={() => setCodes(null)} />;
  } else if (loadFailed) {
    body = (
      <p role="alert" className="text-sm text-(--color-danger-text)">
        Couldn&apos;t load this setting. Please refresh the page.
      </p>
    );
  } else if (status === null) {
    body = <div className="h-9 w-40 animate-pulse rounded-lg bg-(--color-bg-surface-hover)" aria-hidden="true" />;
  } else if (step === "proof") {
    body = <ProofForm askPassword={!usesGoogle} askCode={false} submitLabel={usesGoogle ? "Confirm with Google" : "Continue"} busyLabel="Checking…" busy={busy} error={error} onSubmit={begin} onCancel={cancel} />;
  } else if (step === "scan" && setup) {
    body = (
      <div className="flex flex-col gap-3">
        <ol className="list-decimal pl-5 text-sm text-(--color-text-secondary) flex flex-col gap-1.5">
          <li>
            Open an authenticator app (Google Authenticator, Authy, 1Password…) and add an account.{" "}
            <a href={setup.otpauthUrl} className="font-semibold text-(--color-brand-primary) underline">
              Open in my app
            </a>{" "}
            on this phone, or enter this key by hand:
          </li>
          <li className="list-none -ml-5">
            <code className="block select-all break-all rounded-lg bg-(--color-bg-surface-hover) px-3 py-2 font-mono text-[13px] tracking-[1px] text-(--color-text-primary)">{groupSecret(setup.secret)}</code>
          </li>
          <li>Type the 6-digit code it shows to finish.</li>
        </ol>
        <ProofForm askPassword={false} askCode submitLabel="Turn on" busyLabel="Checking…" busy={busy} error={error} onSubmit={confirm} onCancel={cancel} />
      </div>
    );
  } else if (step === "turn-off" || step === "new-codes") {
    const turning = step === "turn-off";
    body = (
      <ProofForm
        askPassword={!usesGoogle}
        askCode
        codeLabel="Code from your app"
        submitLabel={turning ? "Turn off" : "Get new codes"}
        busyLabel="Checking…"
        busy={busy}
        error={error}
        danger={turning}
        onSubmit={turning ? turnOff : newCodes}
        onCancel={cancel}
      />
    );
  } else if (status.enabled) {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-(--color-success-text)">
          On · {status.recoveryCodesLeft} recovery {status.recoveryCodesLeft === 1 ? "code" : "codes"} left
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setStep("new-codes")} className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-text-secondary) bg-(--color-bg-surface) border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-surface-hover)">
            New recovery codes
          </button>
          <button type="button" onClick={() => setStep("turn-off")} className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-danger) bg-(--color-danger-light) border-0 cursor-pointer hover:opacity-90">
            Turn off
          </button>
        </div>
      </div>
    );
  } else {
    body = (
      <button type="button" onClick={() => setStep("proof")} className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-brand-primary) bg-(--color-brand-primary-light) border-0 cursor-pointer hover:opacity-90">
        Turn on
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2 mb-1">
        <ShieldOutlinedIcon sx={{ fontSize: 20 }} className="text-(--color-brand-primary)" />
        <h2 className="text-base font-semibold text-(--color-text-primary)">Two-step verification</h2>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-4">
        Ask for a code from an authenticator app when signing in, so a stolen password alone isn&apos;t enough to get into your account.
      </p>
      {body}
    </div>
  );
}
