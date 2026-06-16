import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId = "light" | "dark" | "blue" | "purple" | "green";

export interface Theme {
  id: ThemeId;
  label: string;
  icon: string;
  desc: string;
}

export const THEMES: Theme[] = [
  { id: "light",  label: "Light",          icon: "☀️", desc: "Classic navy & gold" },
  { id: "dark",   label: "Dark",           icon: "🌙", desc: "Midnight deep dark" },
  { id: "blue",   label: "Blue Gradient",  icon: "🌊", desc: "Ocean blue & cyan" },
  { id: "purple", label: "Purple Neon",    icon: "💜", desc: "Neon purple glow" },
  { id: "green",  label: "Green Pro",      icon: "🌿", desc: "Professional emerald" },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem("jktm_theme") as ThemeId) ?? "light";
  });

  function setTheme(t: ThemeId) {
    setThemeState(t);
    localStorage.setItem("jktm_theme", t);
  }

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove("dark", "theme-blue", "theme-purple", "theme-green");
    root.removeAttribute("data-theme");

    if (theme === "dark")   { root.classList.add("dark"); }
    else if (theme === "blue")   { root.classList.add("theme-blue"); root.setAttribute("data-theme", "blue"); }
    else if (theme === "purple") { root.classList.add("theme-purple"); root.setAttribute("data-theme", "purple"); }
    else if (theme === "green")  { root.classList.add("theme-green"); root.setAttribute("data-theme", "green"); }
    // "light" is the default :root, no extra class needed
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
