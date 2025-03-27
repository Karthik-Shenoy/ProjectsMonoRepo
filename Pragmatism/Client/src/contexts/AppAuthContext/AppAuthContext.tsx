import { AuthToken } from "@src/core/auth/oauth/OauthContracts"
import * as React from "react"

export type AppAuthContextType = {
    token?: AuthToken
    userName?: string
}

export type AppAuthContextSetters = {
    setAuthContext: (newAuthContext: AppAuthContextType) => void
}

const AppAuthContext = React.createContext<AppAuthContextType & AppAuthContextSetters>({
    token: undefined,

    setAuthContext: () => { }
})

export const AppAuthContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [appAuthContextState, setAppAuthContextState] = React.useState<Partial<AppAuthContextType>>({
        token: undefined,

    });

    return (
        <AppAuthContext.Provider value={{
            ...appAuthContextState,
            setAuthContext: (newAuthContext: AppAuthContextType) => {
                setAppAuthContextState(newAuthContext)
            }
        }}>
            {children}
        </AppAuthContext.Provider>
    )
}

export const useAppAuthContext = () => {
    const context = React.useContext(AppAuthContext)
    if (context == undefined) {
        throw Error("useAppAuthContext hook used outside AuthContext boundary")
    }
    return context
}