import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Inline styles are required by next/og, which does not support CSS classes.
export default async function AppleIcon() {
  const logo = await readFile(path.join(process.cwd(), "public", "CounterCircleIcon.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={110} height={110} alt="" />
      </div>
    ),
    size,
  );
}
