import * as React from "react";

export type Theme = "dark" | "light";

const themeLocalStorageKey = "user-config-theme";
const defaultTheme: Theme = "dark";

type AppThemeContextProps = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

type AppThemeConsumerProps = {
    children: (themeContext: AppThemeContextProps) => React.ReactElement<any>;
}

const AppThemeContext = React.createContext<AppThemeContextProps | null>(null);

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = React.useState<Theme>(() => {
        return (localStorage.getItem(themeLocalStorageKey) || defaultTheme) as Theme
    });

    React.useEffect(() => {
        const rootElement = window.document.documentElement;

        rootElement.classList.remove("dark", "light");
        rootElement.classList.add(theme)
    }, [theme])

    return (
        <AppThemeContext.Provider value={{
            theme,
            setTheme: (theme: Theme) => {
                localStorage.setItem(themeLocalStorageKey, theme);
                setTheme(theme);
            }
        }}>
            {children}
        </AppThemeContext.Provider>
    )
}

export const AppThemeConsumer: React.FC<AppThemeConsumerProps> = ({ children }) => {
    const themeContext = useTheme();
    return (
        <>
            {
                children(themeContext)
            }
        </>
    )
}

export const useTheme = (): AppThemeContextProps => {
    const themeContext = React.useContext(AppThemeContext);
    if (!themeContext) {
        throw Error("useTheme hook was called outside the Theme Context Boundary")
    }
    return themeContext;
}