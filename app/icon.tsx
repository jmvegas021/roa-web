import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Compact brand mark for browser tabs / SERP favicons. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070e1c",
          color: "#c5a87a",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
