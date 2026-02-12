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
        xs: "var(--radius-xs)",     // 4px
        sm: "var(--radius-sm)",     // 6px
        md: "var(--radius-md)",     // 8px
        lg: "var(--radius-lg)",     // 12px
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
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["12px", { lineHeight: "18px" }],
        sm: ["14px", { lineHeight: "20px" }],
        md: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "30px" }],
        // Display sizes
        "display-xs": ["24px", { lineHeight: "32px" }],
        "display-sm": ["30px", { lineHeight: "38px" }],
        "display-md": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
        "display-lg": ["48px", { lineHeight: "60px", letterSpacing: "-0.02em" }],
        "display-xl": ["60px", { lineHeight: "72px", letterSpacing: "-0.02em" }],
        "display-2xl": ["72px", { lineHeight: "90px", letterSpacing: "-0.02em" }],
      },

      /* ===== Spacing — KSA Gov Standard (semantic aliases) ===== */
      spacing: {
        "header": "var(--header-height)", // 72px
      },

      /* ===== Max Width — KSA Gov Standard ===== */
      maxWidth: {
        content: "var(--content-max-width)", // 1280px
        paragraph: "var(--paragraph-max-width)", // 720px
        "width-xxs": "var(--width-xxs)", // 320px
        "width-xs": "var(--width-xs)",   // 384px
        "width-sm": "var(--width-sm)",   // 480px
        "width-md": "var(--width-md)",   // 560px
        "width-lg": "var(--width-lg)",   // 640px
        "width-xl": "var(--width-xl)",   // 768px
        "width-2xl": "var(--width-2xl)", // 1024px
        "width-3xl": "var(--width-3xl)", // 1280px
        "width-4xl": "var(--width-4xl)", // 1440px
        "width-5xl": "var(--width-5xl)", // 1600px
        "width-6xl": "var(--width-6xl)", // 1920px
      },

      /* ===== Box Shadow — KSA Gov Standard (7 levels) ===== */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        "3xl": "var(--shadow-3xl)",
        card: "var(--shadow-card)",
        player: "var(--shadow-player)",
      },
    },
  },
  plugins: [],
};
export default config;
