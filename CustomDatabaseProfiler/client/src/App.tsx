import { AppThemeProvider } from "./Contexts/AppThemeContext/AppThemeContext";
import { AppContextProvider } from "./Contexts/AppContext/AppContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage/HomePage";
import { DatabasePage } from "./Pages/DatabasePage/DatabasePage";

function App() {
    return (
        <AppThemeProvider defaultTheme="system">
            <AppContextProvider>
                <div className="flex min-h-screen font-mono  max-w-[100vw] flex-row bg-background justify-center items-center">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/db" element={<DatabasePage />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </AppContextProvider>
        </AppThemeProvider>
    );
}

export default App;
