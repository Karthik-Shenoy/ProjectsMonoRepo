import * as React from "react";
import { BaseScreenProps, ScreenNames } from "src/ViewControllerInterop/SharedTypes";

export interface AppContextType {
    currentScreenName: ScreenNames | undefined;
    screenPropsMap: Record<ScreenNames, BaseScreenProps | undefined>;
    setCurrentScreenProps: React.Dispatch<Record<ScreenNames, BaseScreenProps | undefined>>;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);


export const AppContextConsumer: React.FC<{
    children: (context: AppContextType) => React.ReactElement | null
}> = ({ children }) => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("AppContextConsumer must be used within an AppContextProvider");
    }
    return children(context);
}
