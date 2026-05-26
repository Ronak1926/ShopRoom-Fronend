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

export type LoginResponse = {
  token: string;
  customer?: Customer;
};
