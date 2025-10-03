export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        palsgaard: {
          ink: "#1e2a2f",
          pine: "#2d4a4f",
          sand: "#f3efe8",
          clay: "#d7cfc4",
          leaf: "#6b8f71",
          accent: "#3f6f7d"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Inter", "Arial"],
        serif: ["ui-serif", "Georgia", "Times New Roman"]
      },
      boxShadow: {
        sheet: "0 8px 24px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};
