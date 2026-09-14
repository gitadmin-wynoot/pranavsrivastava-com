import { ImageResponse } from "next/og";

export const alt = "EVEREST — AI in Production. Climb the mountain. Operate the system.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b1725", color: "#f3f0e9", padding: 70, position: "relative", overflow: "hidden", flexDirection: "column" }}>
      <div style={{ display: "flex", fontSize: 19, color: "#a3e3cf", letterSpacing: 6 }}>AN INTERACTIVE AI EXPEDITION</div>
      <div style={{ display: "flex", marginTop: 76, fontSize: 112, letterSpacing: -7, fontWeight: 700 }}>EVEREST</div>
      <div style={{ display: "flex", fontSize: 32, letterSpacing: 9, color: "#a3e3cf" }}>// AI IN PRODUCTION</div>
      <div style={{ display: "flex", marginTop: 38, maxWidth: 520, fontSize: 26, lineHeight: 1.5, color: "#aab9c9" }}>Climb the mountain. Operate the system. Survive production.</div>
      <div style={{ display: "flex", position: "absolute", right: -75, bottom: -110, width: 0, height: 0, borderLeft: "280px solid transparent", borderRight: "280px solid transparent", borderBottom: "540px solid #344f64", transform: "rotate(9deg)" }} />
      <div style={{ display: "flex", position: "absolute", right: 56, bottom: -30, width: 0, height: 0, borderLeft: "155px solid transparent", borderRight: "155px solid transparent", borderBottom: "400px solid #c4d7d9", transform: "rotate(-7deg)" }} />
      <div style={{ display: "flex", position: "absolute", left: 72, bottom: 42, fontSize: 16, color: "#7790a6", letterSpacing: 3 }}>PRANAV SRIVASTAVA / PROJECTS</div>
    </div>, size,
  );
}
