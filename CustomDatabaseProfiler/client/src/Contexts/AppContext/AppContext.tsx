import * as React from "react";
import { AppContextData, ContextProviderProps } from "./AppContext.types";
import { QueryProfile } from "../../Components/SidePane/Components/LineChart/GradientLineChartProps";

const AppContext = React.createContext<AppContextData>({
    queyProfiles: [],
    setQueryProfiles: (_queryProfiles: QueryProfile[]) => {},
});

export function AppContextProvider({ children, queryProfiles }: ContextProviderProps) {
    const [profiles, setProfiles] = React.useState<QueryProfile[]>(queryProfiles || []);

    const value: AppContextData = {
        queyProfiles: profiles,
        setQueryProfiles: (queryProfiles: QueryProfile[]) => {
            if (queryProfiles.length > 10) {
                queryProfiles.shift();
            }
            setProfiles(queryProfiles);
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
