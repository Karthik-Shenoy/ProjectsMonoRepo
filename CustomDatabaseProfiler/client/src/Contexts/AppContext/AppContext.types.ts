import { QueryProfile } from "../../Components/SidePane/Components/LineChart/GradientLineChartProps";

export type AppContextData = {
    queyProfiles: QueryProfile[];
    setQueryProfiles: (queryProfiles: QueryProfile[]) => void;
};

export type ContextProviderProps = React.PropsWithChildren<{
    queryProfiles?: QueryProfile[];
}>