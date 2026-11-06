/** Pulls the file name the server chose out of a Content-Disposition header, or uses the fallback. */
export function fileNameFrom(header: string | undefined, fallback: string): string {
  const match = header ? /filename="([^"\\/]+)"/.exec(header) : null;
  return match?.[1] ?? fallback;
}
