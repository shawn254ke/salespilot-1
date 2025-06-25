
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(210, 40%, 98%)",
        foreground: "hsl(222.2, 84%, 4.9%)",
        card: "hsl(0, 0%, 100%)",
        "card-foreground": "hsl(222.2, 84%, 4.9%)",
        popover: "hsl(0, 0%, 100%)",
        "popover-foreground": "hsl(222.2, 84%, 4.9%)",
        primary: "hsl(221, 83%, 53%)",
        "primary-foreground": "hsl(210, 40%, 98%)",
        secondary: "hsl(210, 40%, 96.1%)",
        "secondary-foreground": "hsl(222.2, 47.4%, 11.2%)",
        muted: "hsl(210, 40%, 96.1%)",
        "muted-foreground": "hsl(215.4, 16.3%, 46.9%)",
        accent: "hsl(210, 40%, 96.1%)",
        "accent-foreground": "hsl(222.2, 47.4%, 11.2%)",
        destructive: "hsl(0, 84.2%, 60.2%)",
        "destructive-foreground": "hsl(210, 40%, 98%)",
        border: "hsl(214.3, 31.8%, 91.4%)",
        input: "hsl(214.3, 31.8%, 91.4%)",
        ring: "hsl(221, 83%, 53%)",
        sidebar: {
          background: "hsl(222, 47%, 11%)",
          foreground: "hsl(210, 40%, 98%)",
          primary: "hsl(221, 83%, 53%)",
          "primary-foreground": "hsl(0, 0%, 98%)",
          accent: "hsl(217, 33%, 17%)",
          "accent-foreground": "hsl(210, 40%, 98%)",
          border: "hsl(217, 33%, 18%)",
          ring: "hsl(224, 76%, 48%)",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
