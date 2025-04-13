import { AppAuthContextType } from "./AppAuthContext";

export const isUserLoggedIn = (appAuthContext: AppAuthContextType) => {
    if (appAuthContext.userName === undefined || appAuthContext.userId === undefined) {
        return false;
    }
    return true;
};

export const STATUS_CODE_PREFIX = "status_code:";
