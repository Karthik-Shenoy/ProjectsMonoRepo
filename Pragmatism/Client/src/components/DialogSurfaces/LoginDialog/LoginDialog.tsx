import * as React from "react"
import { Button } from "@shadcn/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@shadcn/components/ui/dialog"
import { FlexDiv, FlexItem } from "@src/components/FlexBox"
import { OauthManager, OauthProvider } from "@src/core/auth/oauth/OauthManager"
import { Image } from "@src/components/Image/Image"
import { AppAuthContextSetters, useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext"


export type LoginDialogProps = {
    closeDialogCallback: () => void
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ closeDialogCallback }) => {

    const authContext = useAppAuthContext()

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Login options
                </DialogTitle>
            </DialogHeader>
            <FlexDiv horizontal={false} className="justify-center items-center">
                <FlexItem>
                    <Button className="cursor-pointer" onClick={() => googleLoginClickHandler(authContext, closeDialogCallback)}>
                        Sign In With Google
                        <Image url="/icons/google.svg" width={32} height={32} />
                    </Button>

                </FlexItem>
            </FlexDiv>
        </DialogContent>
    )
}

const googleLoginClickHandler = (authContextSetters: AppAuthContextSetters, closeDialogCallback: () => void) => {
    const oauthMgr = OauthManager.getInstance(OauthProvider.Google)
    oauthMgr.redirectToAuthPage().then((authContext) => {
        closeDialogCallback()
        authContextSetters.setAuthContext(authContext)
    });
}