/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jozi: {
          navy: "#0c2340",
          "navy-dark": "#071526",
          "navy-light": "#0f294a",
          "navy-card": "#132e52",
          cyan: "#00a8e8",
          "cyan-light": "#00b4d8",
          "cyan-hover": "#33bcf0",
          amber: "#f9a825",
          "amber-light": "#fbc02d",
          green: "#2e7d32",
          "green-light": "#43a047",
          "green-fresh": "#388e3c",
          white: "#ffffff",
          tint: "#f4f7fb",
          "tint-card": "#eef2f8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(0, 168, 232, 0.35)",
        "glow-lg": "0 0 40px rgba(0, 168, 232, 0.45)",
        soft: "0 10px 30px -5px rgba(12, 35, 64, 0.08)",
        card: "0 14px 35px -10px rgba(12, 35, 64, 0.12)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
