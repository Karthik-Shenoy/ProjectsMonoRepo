import { Dialog } from "@shadcn/components/ui/dialog"
import * as React from "react"
import { useNavigate } from "react-router"
import { ErrorDialog } from "./ErrorDialog"

export type ErrorDialogBlockingProps = {
    showErrorDialog: boolean
}

export const ErrorDialogBlocking: React.FC<ErrorDialogBlockingProps> = ({ showErrorDialog }) => {
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        setDialogOpen(showErrorDialog)
    }, [showErrorDialog])

    const closeDialog = () => {
        setDialogOpen(false)
    }

    const onOpenChange = (shouldOpenDialog: boolean) => {
        if (shouldOpenDialog) {
            return;
        }

        navigate("/")
        setTimeout(() => {
            window.location.reload()
        })
    }

    return (
        <Dialog open={dialogOpen} defaultOpen={dialogOpen} onOpenChange={onOpenChange}>
            <ErrorDialog closeDialogCallback={closeDialog} />
        </Dialog>
    )
}