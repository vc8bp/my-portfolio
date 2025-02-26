import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        navy: "var(--navy)",
        muted: "var(--color-muted)",
        buttonBorder: "var(--color-button-border)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Modern, clean font
        mono: ['SF Mono','Fira Code','Fira Mono','Roboto Mono',"monospace"]
      },
      spacing: {
        '18': '4.5rem', // Custom spacing value
      },
      boxShadow: {
        'glow': '0 0 10px rgba(100, 255, 218, 0.5)', // Glow effect for buttons
      }
    },
  },
  plugins: [],
} satisfies Config;
