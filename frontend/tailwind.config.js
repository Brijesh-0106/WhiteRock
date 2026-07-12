export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#0b0f19",
        secondaryBg: "#111827",
        cardBg: "rgba(17, 24, 39, 0.7)",
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        bgCard: "var(--bg-card)",
        borderColor: "var(--border-color)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        accentPrimary: "var(--accent-primary)",
        accentPrimaryHover: "var(--accent-primary-hover)",
        accentSuccess: "var(--accent-success)",
        accentWarning: "var(--accent-warning)",
        accentDanger: "var(--accent-danger)",
        accentInfo: "var(--accent-info)",
        glowColor: "var(--glow-color)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      }
    },
  },
  plugins: [],
}
