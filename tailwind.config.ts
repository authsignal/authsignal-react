import { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const SPACE_MULTIPLIER = [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

function generateSpaceScale() {
  return Object.fromEntries(
    SPACE_MULTIPLIER.map((multiplier) => {
      return [
        multiplier,
        `calc(${multiplier} * var(--as-spacing-unit, 0.25rem))`,
      ];
    }),
  );
}

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "as-",
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      borderRadius: {
        lg: "var(--as-border-radius)",
        md: "calc(var(--as-border-radius) - 2px)",
        sm: "calc(var(--as-border-radius) - 4px)",
      },
      colors: {
        background: "var(--as-color-background)",
        foreground: "var(--as-color-foreground)",
        primary: {
          DEFAULT: "var(--as-color-primary)",
          foreground: "var(--as-color-primary-foreground)",
        },
        muted: "var(--as-color-muted)",
        danger: "var(--as-color-danger)",
        "input-border": "var(--as-color-input-border)",
        ring: "var(--as-color-ring)",
      },
      spacing: {
        ...generateSpaceScale(),
      },
      animation: {
        shake: "shake 0.15s ease-in-out 0s 2",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      keyframes: {
        shake: {
          "25%": {
            transform: "translate3d(3px, 0, 0)",
          },
          "75%": {
            transform: "translate3d(-3px, 0, 0)",
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
  corePlugins: {
    preflight: false,
  },
} satisfies Config;

export default config;
