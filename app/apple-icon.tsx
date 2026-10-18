import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#07090e",
          borderRadius: "36px",
          border: "4px solid #ffaa00",
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gear teeth */}
          <circle cx="12" cy="12" r="9" stroke="#ffaa00" strokeWidth="2" strokeDasharray="3 3" />
          {/* Penguin body silhouette */}
          <ellipse cx="12" cy="13.5" rx="4.5" ry="5.5" fill="#f5f5f5" />
          <ellipse cx="12" cy="14" rx="3.2" ry="4.2" fill="#07090e" />
          {/* Beak */}
          <polygon points="12,11 10.5,12.5 13.5,12.5" fill="#ffaa00" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
