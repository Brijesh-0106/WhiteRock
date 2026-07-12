export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#1e1e1f",
        bgSecondary: "#2c2c2a",
        bgCard: "rgba(44, 44, 42, 0.7)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        textPrimary: "#c3c2b7",
        textSecondary: "#8e8d85",
        accentPrimary: "#d97706",
        accentPrimaryHover: "#b45309",
        accentSuccess: "#10b981",
        accentWarning: "#f59e0b",
        accentDanger: "#ef4444",
        accentInfo: "#06b6d4",
        glowColor: "rgba(217, 119, 6, 0.15)",
      },
      fontFamily: {
        sans: ["'Outfit'", "sans-serif"],
      }
    },
  },
  plugins: [],
}
