import * as React from "react";
import { Theme, ThemeProviderContextData, ThemeProviderProps } from "./AppThemeContext.types";

const AppThemeContext = React.createContext<ThemeProviderContextData>({
    theme: "light",
    setTheme: () => {}
});


export function AppThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "app-ui-theme",
    ...props
  }: ThemeProviderProps) {
    const [theme, setTheme] = React.useState<Theme>(
      () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )
   
    React.useEffect(() => {
      const root = window.document.documentElement
   
      root.classList.remove("light", "dark")
   
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"
   
        root.classList.add(systemTheme)
        return
      }
   
      root.classList.add(theme)
    }, [theme])
   
    const value = {
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
      },
    }
   
    return (
      <AppThemeContext.Provider {...props} value={value}>
        {children}
      </AppThemeContext.Provider>
    )
  }
   
  export const useTheme = () => {
    const context = React.useContext(AppThemeContext)
   
    if (context === undefined)
      throw new Error("useTheme must be used within a ThemeProvider")
   
    return context
  }