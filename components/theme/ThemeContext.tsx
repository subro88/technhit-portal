"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type SiteTheme = "cyber" | "field-guide";

interface ThemeContextType {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
  isFieldGuide: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyber",
  setTheme: () => {},
  toggleTheme: () => {},
  isFieldGuide: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<SiteTheme>("cyber");
  const [userOverridden, setUserOverridden] = useState<boolean>(false);

  // Sync with route or stored preference
  useEffect(() => {
    const saved = localStorage.getItem("technhit-theme") as SiteTheme | null;
    const isMathRoute =
      pathname.startsWith("/stem-10-plus-2") ||
      pathname.startsWith("/visual-lab");

    if (!isMathRoute) {
      setThemeState("cyber");
      return;
    }

    if (saved && (saved === "cyber" || saved === "field-guide")) {
      setThemeState(saved);
      setUserOverridden(true);
    } else {
      setThemeState("field-guide");
      setUserOverridden(false);
    }
  }, [pathname]);

  const setTheme = (newTheme: SiteTheme) => {
    setThemeState(newTheme);
    setUserOverridden(true);
    try {
      localStorage.setItem("technhit-theme", newTheme);
    } catch (e) {
      // storage unavailable
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "cyber" ? "field-guide" : "cyber");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isFieldGuide: theme === "field-guide",
      }}
    >
      <div
        className={
          theme === "field-guide"
            ? "theme-field-guide min-h-screen transition-colors duration-300"
            : "min-h-screen transition-colors duration-300"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
