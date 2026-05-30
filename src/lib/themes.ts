export interface ThemePreset {
  id: string;
  name: string;
  accent: string;
  light: string;
  glow: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "violet",  name: "Violet",  accent: "#7C3AED", light: "#A78BFA", glow: "rgba(124,58,237,0.5)"  },
  { id: "indigo",  name: "Indigo",  accent: "#4F46E5", light: "#818CF8", glow: "rgba(79,70,229,0.5)"   },
  { id: "blue",    name: "Blue",    accent: "#2563EB", light: "#60A5FA", glow: "rgba(37,99,235,0.5)"   },
  { id: "cyan",    name: "Cyan",    accent: "#0891B2", light: "#22D3EE", glow: "rgba(8,145,178,0.5)"   },
  { id: "teal",    name: "Teal",    accent: "#0D9488", light: "#2DD4BF", glow: "rgba(13,148,136,0.5)"  },
  { id: "emerald", name: "Emerald", accent: "#059669", light: "#34D399", glow: "rgba(5,150,105,0.5)"   },
  { id: "rose",    name: "Rose",    accent: "#E11D48", light: "#FB7185", glow: "rgba(225,29,72,0.5)"   },
  { id: "orange",  name: "Orange",  accent: "#EA580C", light: "#FB923C", glow: "rgba(234,88,12,0.5)"   },
  { id: "pink",    name: "Pink",    accent: "#DB2777", light: "#F472B6", glow: "rgba(219,39,119,0.5)"  },
];

export const DEFAULT_THEME = THEME_PRESETS[0];

export function getTheme(accentColor?: string | null): ThemePreset {
  if (!accentColor) return DEFAULT_THEME;
  return THEME_PRESETS.find((t) => t.accent === accentColor) ?? DEFAULT_THEME;
}
