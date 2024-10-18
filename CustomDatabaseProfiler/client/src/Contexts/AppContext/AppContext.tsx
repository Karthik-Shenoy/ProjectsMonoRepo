import * as React from "react";
import { AppContextData, ContextProviderProps } from "./AppContext.types";
import { QueryProfile } from "../../Components/SidePane/Components/LineChart/GradientLineChartProps";

const AppContext = React.createContext<AppContextData>({
    queyProfiles: [],
    clientId: undefined,
    storageEngine: undefined,
    setQueryProfiles: (_queryProfiles: QueryProfile[]) => {},
    setClientId: (_clientId: string) => {},
    setStorageEngine: (_engine: string) => {},
});

export function AppContextProvider({ children, queryProfiles }: ContextProviderProps) {
    const [profiles, setProfiles] = React.useState<QueryProfile[]>(queryProfiles || []);
    const [clientId, setClientId] = React.useState<string>("");
    const [storageEngine, setStorageEngine] = React.useState<string>("");

    const value: AppContextData = {
        queyProfiles: profiles,
        clientId,
        storageEngine,
        setQueryProfiles: (queryProfiles: QueryProfile[]) => {
            if (queryProfiles.length > 10) {
                queryProfiles.shift();
            }
            setProfiles(queryProfiles);
        },
        setClientId: (clientId: string) => {
            setClientId(clientId);
        },
        setStorageEngine: (engine: string) => {
            setStorageEngine(engine);
        },
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
    const context = React.useContext(AppContext);

    if (context === undefined) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
};
