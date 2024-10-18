import { QueryProfile } from "../../Components/SidePane/Components/LineChart/GradientLineChartProps";

export type AppContextData = {
    queyProfiles: QueryProfile[];
    clientId?: string;
    storageEngine?: string;
    setQueryProfiles: (queryProfiles: QueryProfile[]) => void;
    setClientId: (clientId: string) => void;
    setStorageEngine: (engine: string) => void;
};

export type ContextProviderProps = React.PropsWithChildren<{
    queryProfiles?: QueryProfile[];
}>