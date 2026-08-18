import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content/team";

export const runtime = "edge";
export const alt = `${SITE.brand} · ${SITE.office}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px",
          background: "linear-gradient(135deg, #070e1c 0%, #0e1830 55%, #1a2744 100%)",
          color: "#f2f4f7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#c5a87a",
            marginBottom: 24,
          }}
        >
          {SITE.brand}
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 900 }}>
          {SITE.office}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#9aa6b8",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Belton · Temple · Central Texas
        </div>
      </div>
    ),
    { ...size }
  );
}
