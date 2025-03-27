import { Dialog } from "@shadcn/components/ui/dialog"
import { useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext"
import { isUserLoggedIn } from "@src/contexts/AppAuthContext/AppAuthContextUtils"
import * as React from "react"
import { useNavigate } from "react-router"
import { LoginDialog } from "./LoginDialog"

export const LoginDialogBlocking = () => {
    const authContext = useAppAuthContext()
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(() => !isUserLoggedIn(authContext))
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
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
            <LoginDialog closeDialogCallback={closeDialog} />
        </Dialog>
    )
}