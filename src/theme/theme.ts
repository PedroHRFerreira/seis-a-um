export const theme = {
  colors: {
    background: "#131313",
    surface: "#131313",
    surfaceDim: "#131313",
    surfaceBright: "#393939",
    surfaceStrong: "#2a2a2a",
    card: "#1c1b1b",
    cardElevated: "#201f1f",
    pitch: "#2d5a27",
    pitchDark: "#0a3909",
    text: "#e5e2e1",
    textMuted: "#c2c9bb",
    textDim: "#8c9387",
    line: "#42493e",
    neon: "#a1d494",
    lime: "#bcf0ae",
    amber: "#ffb4a8",
    danger: "#ce0301",
    dangerSoft: "#ffb4a8",
    white: "#ffffff",
    black: "#000000"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 0,
    md: 0,
    lg: 0
  },
  typography: {
    display: {
      fontFamily: "Anton_400Regular",
      fontSize: 64,
      lineHeight: 70,
      letterSpacing: 1.28
    },
    headline: {
      fontFamily: "Anton_400Regular",
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: 1.6
    },
    headlineMobile: {
      fontFamily: "Anton_400Regular",
      fontSize: 24,
      lineHeight: 29,
      letterSpacing: 1.2
    },
    body: {
      fontFamily: "JetBrainsMono_400Regular",
      fontSize: 16,
      lineHeight: 26
    },
    bodySmall: {
      fontFamily: "JetBrainsMono_400Regular",
      fontSize: 14,
      lineHeight: 21
    },
    label: {
      fontFamily: "JetBrainsMono_700Bold",
      fontSize: 12,
      lineHeight: 14,
      letterSpacing: 0.4
    }
  },
  shadow: {
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4
  }
} as const;

export type Theme = typeof theme;
