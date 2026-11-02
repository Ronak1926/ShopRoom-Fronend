import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og renders this markup with its own engine, which only understands inline styles
// and flexbox; Tailwind classes and CSS variables are not available here.
export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", "ShopRoomIcon.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(135deg, #4329bb 0%, #6c47ff 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 96, height: 96, borderRadius: 24, background: "#ffffff" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={58} height={52} alt="" />
          </div>
          <div style={{ fontSize: 56, fontWeight: 800 }}>{SITE_NAME}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 76, fontWeight: 800, lineHeight: 1.08, maxWidth: 940 }}>{`${SITE_TAGLINE}.`}</div>
        <div style={{ marginTop: 28, fontSize: 32, opacity: 0.85, maxWidth: 900 }}>
          A room for every shop. Chat, announcements and animated notifications.
        </div>
      </div>
    ),
    size,
  );
}
