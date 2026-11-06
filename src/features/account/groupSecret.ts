/** Groups a secret in fours so it is easy to type into an authenticator app by hand. */
export function groupSecret(secret: string): string {
  return secret.replace(/(.{4})/g, "$1 ").trim();
}
