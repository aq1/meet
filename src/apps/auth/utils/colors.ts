export const userColors = {
  orange: { light: "#c2410c", dark: "#fb923c" },
  amber: { light: "#b45309", dark: "#fbbf24" },
  lime: { light: "#4d7c0f", dark: "#a3e635" },
  emerald: { light: "#047857", dark: "#34d399" },
  cyan: { light: "#0e7490", dark: "#22d3ee" },
  blue: { light: "#2563eb", dark: "#60a5fa" },
  indigo: { light: "#4f46e5", dark: "#818cf8" },
  violet: { light: "#7c3aed", dark: "#a78bfa" },
  fuchsia: { light: "#c026d3", dark: "#e879f9" },
  rose: { light: "#e11d48", dark: "#fb7185" },
} as const;

export type UserColor = keyof typeof userColors;

export const userColorNames = Object.keys(userColors) as [UserColor, ...UserColor[]];

export const randomUserColor = (): UserColor => userColorNames[Math.floor(Math.random() * userColorNames.length)];
