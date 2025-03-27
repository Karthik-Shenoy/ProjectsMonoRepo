import { AppAuthContextType } from "./AppAuthContext";

export const isUserLoggedIn = (appAuthContext: AppAuthContextType) => {
    if (appAuthContext.token === undefined && appAuthContext.userName === undefined) {
        return false;
    }
    return true;
};
