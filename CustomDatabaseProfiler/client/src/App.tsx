import { AppThemeProvider } from "./Contexts/AppThemeContext/AppThemeContext";
import { MainArea } from "./Components/MainArea/MainArea";
import { SidePane } from "./Components/SidePane/SidePane";
import { AppContextProvider } from "./Contexts/AppContext/AppContext";

function App() {
    return (
        <AppThemeProvider defaultTheme="system">
            <AppContextProvider>
                <div className="flex min-h-screen font-mono  max-w-[100vw] flex-row bg-background justify-center items-center">
                    {/* main area */}
                    <MainArea />
                    <SidePane />
                </div>
            </AppContextProvider>
        </AppThemeProvider>
    );
}

export default App;
