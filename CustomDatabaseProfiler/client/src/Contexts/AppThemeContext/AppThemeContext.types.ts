export type Theme = "dark" | "light" | "system";

export type ThemeProviderContextData = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export type ThemeProviderProps = React.PropsWithChildren<{
    defaultTheme?: Theme;
    storageKey?: string;
}>;