import * as React from "react"
import { Button } from "@shadcn/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@shadcn/components/ui/dialog"
import { FlexDiv, FlexItem } from "@src/components/FlexBox"
import { OauthManager, OauthProvider } from "@src/core/auth/oauth/OauthManager"
import { Image } from "@src/components/Image/Image"
import { AppAuthContextSetters, useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext"
import BasicSpinner from "@src/components/Loaders/BasicSpinner"
import { AppInfoTile, TileType } from "@src/components/AppInfoTile"
import { SetLoginDialogAsyncStateCallback } from "./useLoginDialogRefersh"


export type LoginDialogProps = {
    closeDialogCallback: () => void,
    loginDialogAsyncState: LoginDialogAsyncState,
    setLoginDialogAsyncState: SetLoginDialogAsyncStateCallback
}

export type LoginDialogAsyncState = {
    isLoading: boolean,
    error: null
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ closeDialogCallback, loginDialogAsyncState, setLoginDialogAsyncState }) => {

    const authContext = useAppAuthContext()

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Login options
                </DialogTitle>
            </DialogHeader>
            <FlexDiv horizontal={false} className="justify-center items-center">
                {renderDialogContent(loginDialogAsyncState, () => googleLoginClickHandler(authContext, setLoginDialogAsyncState, closeDialogCallback))}
            </FlexDiv>
        </DialogContent>
    )
}

const renderDialogContent = (asyncState: LoginDialogAsyncState, onSignInClick: () => void) => {
    if (asyncState.isLoading) {
        return <BasicSpinner />
    }
    if (asyncState.error) {
        return <AppInfoTile tileType={TileType.Error} size={32} description="Something went wrong" />
    }
    return (
        <FlexItem>
            <Button className="cursor-pointer" onClick={onSignInClick}>
                Sign In With Google
                <Image url="/icons/google.svg" width={32} height={32} />
            </Button>
        </FlexItem>
    )
}

const googleLoginClickHandler = (
    authContextSetters: AppAuthContextSetters,
    setAsyncState: SetLoginDialogAsyncStateCallback,
    closeDialogCallback: () => void
) => {
    const oauthMgr = OauthManager.getInstance(OauthProvider.Google)
    setAsyncState({
        isLoading: true,
        error: null
    })

    oauthMgr.redirectToAuthPage().then((authContext) => {
        setAsyncState({
            isLoading: false,
            error: null
        })
        closeDialogCallback()
        authContextSetters.setAuthContext(authContext)
        
    }).catch((error) => {
        setAsyncState({
            isLoading: false,
            error: error
        })
    })
}