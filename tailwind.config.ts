import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ===== Colors ===== */
      colors: {
        // Brand (identity)
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "var(--color-secondary-dark)",
          light: "var(--color-secondary-light)",
        },
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        // Functional
        border: "var(--color-border)",
        "border-secondary": "var(--color-border-secondary)",
        "button-black": "var(--color-button-black)",
        // Text
        "text-display": "var(--color-text-display)",
        "text-paragraph": "var(--color-text-paragraph)",
        "text-secondary": "var(--color-text-secondary)",
        // Background
        "bg-card": "var(--color-bg-card)",
        "bg-neutral-50": "var(--color-bg-neutral-50)",
        "bg-neutral-100": "var(--color-bg-neutral-100)",
        "bg-neutral-200": "var(--color-bg-neutral-200)",
      },

      /* ===== Border Radius — KSA Gov Standard ===== */
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",     // 4px
        md: "var(--radius-md)",     // 8px
        lg: "var(--radius-lg)",     // 16px
        xl: "var(--radius-xl)",     // 24px
        full: "var(--radius-full)", // 9999px
      },

      /* ===== Font ===== */
      fontFamily: {
        primary: "var(--font-primary)",
      },

      /* ===== Font Size — KSA Gov Type Scale ===== */
      fontSize: {
        // Text sizes
        xs: ["12px", { lineHeight: "18px" }],
        sm: ["14px", { lineHeight: "20px" }],
        md: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "30px" }],
        // Display sizes
        "display-xs": ["24px", { lineHeight: "32px" }],
        "display-sm": ["30px", { lineHeight: "38px" }],
        "display-lg": ["48px", { lineHeight: "60px", letterSpacing: "-0.02em" }],
        "display-xl": ["60px", { lineHeight: "72px", letterSpacing: "-0.02em" }],
        "display-2xl": ["72px", { lineHeight: "90px", letterSpacing: "-0.02em" }],
      },

      /* ===== Spacing — KSA Gov Standard (supplementary aliases) ===== */
      spacing: {
        "header": "var(--header-height)", // 72px
      },

      /* ===== Max Width ===== */
      maxWidth: {
        content: "var(--content-max-width)", // 1280px
      },

      /* ===== Box Shadow — KSA Gov Standard ===== */
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-card)",
        player: "var(--shadow-player)",
      },
    },
  },
  plugins: [],
};
export default config;
