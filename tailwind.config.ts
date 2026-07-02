import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F7FC",
        surface: "#FFFFFF",
        ink: "#14213D",
        muted: "#5F6F81",
        border: "#E5ECF5",
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#EAF2FF",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#EAF8EE",
        },
        warn: {
          DEFAULT: "#F59E0B",
          light: "#FFF6E6",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FDECEC",
        },
        violet: {
          DEFAULT: "#7C3AED",
          light: "#F4ECFF",
        },
      },
      borderRadius: {
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 10px 30px rgba(20, 33, 61, 0.06)",
        pop: "0 18px 40px rgba(20, 33, 61, 0.10)",
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
