import { ImageResponse } from "next/og";

export const alt = "Pranav Srivastava — AI that holds up in production";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card (the preview when a link is posted to LinkedIn/X).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* PS mark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fafafa",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            PS
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: "#3b82f6",
              }}
            />
          </div>
        </div>

        {/* Name + line */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#fafafa", lineHeight: 1.05 }}>
            Pranav Srivastava
          </div>
          <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 22 }}>
            AI that holds up in production.
          </div>
        </div>

        {/* Range of work */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#52525b" }}>
          <span>Labs</span>
          <span style={{ margin: "0 14px" }}>·</span>
          <span>Courses</span>
          <span style={{ margin: "0 14px" }}>·</span>
          <span>Essays</span>
          <span style={{ margin: "0 14px" }}>·</span>
          <span>Netherlands</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
