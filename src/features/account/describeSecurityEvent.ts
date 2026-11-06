interface EventShape {
  type: string;
  detail: { method?: string; action?: string } | null;
}

const ACTION_LABELS: Record<string, string> = {
  delete_account: "deleting the account",
  export_data: "downloading data",
  change_password: "changing the password",
  disable_mfa: "turning off two-step verification",
};

/** What happened, in words an account owner understands. `warning` marks the events worth a second look. */
export function describeSecurityEvent(event: EventShape): { label: string; warning: boolean } {
  switch (event.type) {
    case "LOGIN_SUCCESS":
      return { label: event.detail?.method === "google" ? "Signed in with Google" : "Signed in", warning: false };
    case "LOGIN_FAILED":
      return { label: "Failed sign-in attempt (wrong password)", warning: true };
    case "PASSWORD_CHANGED":
      return { label: "Password changed", warning: false };
    case "PASSWORD_RESET":
      return { label: "Password reset with an emailed link", warning: false };
    case "SESSIONS_REVOKED":
      return { label: "Signed out of all devices", warning: false };
    case "DATA_EXPORTED":
      return { label: "Data downloaded", warning: false };
    case "REAUTH_FAILED": {
      const what = event.detail?.action ? ACTION_LABELS[event.detail.action] : undefined;
      return { label: what ? `Wrong password when ${what}` : "Wrong password when confirming an action", warning: true };
    }
    case "MFA_ENABLED":
      return { label: "Two-step verification turned on", warning: false };
    case "MFA_DISABLED":
      return { label: "Two-step verification turned off", warning: true };
    case "MFA_FAILED":
      return { label: "Wrong two-step code at sign-in", warning: true };
    case "MFA_RECOVERY_USED":
      return { label: "Signed in with a recovery code", warning: true };
    default:
      return { label: "Account activity", warning: false };
  }
}
