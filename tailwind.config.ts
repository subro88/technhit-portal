import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          950: "#05070a",
          900: "#07090e",
          850: "#0b0f17",
          800: "#0f1623",
          750: "#141d2e",
          700: "#1a253a",
          600: "#273754",
          border: "rgba(255, 255, 255, 0.08)",
          cyan: "#00f5d4",
          emerald: "#10b981",
          purple: "#bd00ff",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "laser-scan": "laserScan 3s linear infinite",
        "led-blink": "ledBlink 1.2s infinite",
      },
      keyframes: {
        laserScan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        ledBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
