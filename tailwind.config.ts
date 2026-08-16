import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#020C1C",
          bgAlt: "#071A2F",
          surface: "#0E2239",
          accent: "#F2994A",
          accentHover: "#E8892F"
        },
        // BF_WEBSITE_BOREAL_UI_v1 - palette from the approved mockup.
        boreal: {
          ink: "#0B1F3A",
          inkDeep: "#102A4B",
          body: "#51617D",
          line: "#E4EAF2",
          mist: "#F5F8FC",
          gold: "#BF9B49",
          goldDeep: "#A8792A",
          muted: "#9FB0C6"
        }
      },
      fontFamily: {
        display: ["'Libre Caslon Text'", "Georgia", "serif"],
        sans: ["'Public Sans'", "system-ui", "sans-serif"]
      },
      borderColor: {
        subtle: "rgba(255,255,255,0.05)",
        card: "rgba(255,255,255,0.1)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
}

export default config
