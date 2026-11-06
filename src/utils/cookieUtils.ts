const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Marks the cookie HTTPS-only wherever the site is served over HTTPS (plain-http localhost still works). */
function secureFlag(): string {
  return window.location.protocol === "https:" ? "; Secure" : "";
}

export function setCookie(name: string, value: string, ms = SEVEN_DAYS): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + ms).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict${secureFlag()}`;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict${secureFlag()}`;
}
