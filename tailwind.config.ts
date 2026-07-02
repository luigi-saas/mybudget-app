import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F3F6FA",
        surface: "#FFFFFF",
        ink: "#0F1B2B",
        muted: "#64748B",
        border: "#E7ECF1",
        primary: {
          DEFAULT: "#1CA7EC",
          dark: "#0E86C9",
          light: "#E6F5FD",
        },
        success: {
          DEFAULT: "#17B26A",
          light: "#E7F9F0",
        },
        warn: {
          DEFAULT: "#FF8A3D",
          light: "#FFF1E6",
        },
        danger: {
          DEFAULT: "#EF4E5F",
          light: "#FDECEE",
        },
        violet: {
          DEFAULT: "#7C6CF0",
          light: "#EEEBFD",
        },
      },
      borderRadius: {
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 27, 43, 0.06)",
        pop: "0 12px 32px rgba(15, 27, 43, 0.10)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
