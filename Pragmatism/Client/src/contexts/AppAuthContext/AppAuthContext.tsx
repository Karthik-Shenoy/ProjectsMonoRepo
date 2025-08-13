import { DTO } from "@src/dto/dto"
import { useQuery } from "@tanstack/react-query"
import * as React from "react"
import { STATUS_CODE_PREFIX } from "./AppAuthContextUtils"

/**
 * Right now this only contains some user data like name and profile picture URL
 * We might need to extend this to include tokens too
 */
export type AppAuthContextType = {
    userName?: string
    userId?: string
    userProfilePictureUrl?: string
}

export type AppAuthContextSetters = {
    setAuthContext: (newAuthContext: AppAuthContextType) => void
}

const AppAuthContext = React.createContext<AppAuthContextType & AppAuthContextSetters>({
    setAuthContext: () => { }
})

export const AppAuthContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [appAuthContextState, setAppAuthContextState] = React.useState<AppAuthContextType>({});

    // send a get request to see if the user ia already authenticated and has auth token in cookies
    const { isFetching, data, error } = useQuery(
        {
            queryKey: ["/auth"],
            queryFn: async () => {
                let response = await fetch(
                    `${__API_URL__}/auth`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                if (!response.ok) {
                    throw new Error(STATUS_CODE_PREFIX + response.status)
                }
                let user = await response.json() as DTO.User
                return user
            },
            retry: (failureCount, error): boolean => {
                if (failureCount >= 3) {
                    return false
                }
                if(error.message.startsWith(STATUS_CODE_PREFIX)) { 
                    const statusCode = error.message.substring(STATUS_CODE_PREFIX.length)
                    if (statusCode == "401") {
                        return false
                    }
                }
                return true
            }
        },
    )

    if (!isFetching && !error && data) {
        // check if state changed
        if (appAuthContextState.userName !== data.name || appAuthContextState.userId !== data.id) {
            setAppAuthContextState({
                userId: data.id,
                userName: data.name,
                userProfilePictureUrl: data.picture
            })
        }
        
    }

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