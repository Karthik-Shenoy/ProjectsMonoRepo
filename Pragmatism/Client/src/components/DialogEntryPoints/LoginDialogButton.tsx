import * as React from "react"
import { Button } from "@shadcn/components/ui/button"
import { Dialog, DialogTrigger } from "@shadcn/components/ui/dialog"
import { LoginDialog } from "../DialogSurfaces/LoginDialog/LoginDialog"
import { useLoginDialogAsyncState } from "../DialogSurfaces/LoginDialog/useLoginDialogRefersh"

export const LoginDialogButton: React.FC<{}> = () => {
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
    const { loginDialogAsyncState, setLoginDialogAsyncState, refreshLoginDialogAsyncState } = useLoginDialogAsyncState()

    const openDialog = () => {
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setDialogOpen(false)
    }


    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={(shouldOpenDialog) => {
                // handle dialog close click
                if (shouldOpenDialog == false) {
                    closeDialog()
                    refreshLoginDialogAsyncState()
                }
            }}>
                <DialogTrigger asChild>
                    <Button className="cursor-pointer" onClick={openDialog}>Login</Button>
                </DialogTrigger>
                <LoginDialog loginDialogAsyncState={loginDialogAsyncState} setLoginDialogAsyncState={setLoginDialogAsyncState} closeDialogCallback={closeDialog} />
            </Dialog>
        </>
    )
}