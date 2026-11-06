export type Customer = {
  id: string;
  fullName: string;
  email: string;
  allowLocationAccess: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  allowLocationAccess?: boolean;
  latitude?: number;
  longitude?: number;
};

export type GoogleAuthRequest = {
  idToken: string;
};

/** The session itself arrives in an HttpOnly cookie; the body carries only what the page shows. */
export type LoginResponse = {
  /** Who signed in. Not a secret: the page keeps it to know which messages are the viewer's own. */
  customerId: string;
  customer?: Customer;
};

/** The password was right but the account has two-step verification: a code is still needed. */
export type MfaRequiredResponse = {
  mfaRequired: true;
  mfaToken: string;
};
