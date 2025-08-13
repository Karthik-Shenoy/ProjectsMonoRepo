import * as React from "react"
import { Dialog } from "@shadcn/components/ui/dialog"
import { useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext"
import { isUserLoggedIn } from "@src/contexts/AppAuthContext/AppAuthContextUtils"
import { useNavigate } from "react-router"
import { LoginDialog } from "./LoginDialog"
import { useLoginDialogAsyncState } from "./useLoginDialogRefersh"

export const LoginDialogBlocking = () => {
    const authContext = useAppAuthContext()
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(() => !isUserLoggedIn(authContext))
    const { loginDialogAsyncState, refreshLoginDialogAsyncState, setLoginDialogAsyncState } = useLoginDialogAsyncState()
    const navigate = useNavigate()

    const closeDialog = () => {
        setDialogOpen(false)
    }

    const onOpenChange = (shouldOpenDialog: boolean) => {
        if (shouldOpenDialog) {
            return;
        }

        if (!isUserLoggedIn(authContext)) {
            navigate("/")
            refreshLoginDialogAsyncState()
        }
    }

    React.useEffect(() => {
        if (isUserLoggedIn(authContext)) {
            setDialogOpen(false)
        }
    }, [authContext])

    return (
        <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
            <LoginDialog loginDialogAsyncState={loginDialogAsyncState} setLoginDialogAsyncState={setLoginDialogAsyncState} closeDialogCallback={closeDialog} />
        </Dialog>
    )
}