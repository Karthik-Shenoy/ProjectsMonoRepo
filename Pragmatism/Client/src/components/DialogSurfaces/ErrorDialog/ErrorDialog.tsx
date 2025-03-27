import * as React from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@shadcn/components/ui/dialog"
import { FlexDiv, FlexItem } from "@src/components/FlexBox"
import { AppInfoTile, TileType } from "@src/components/AppInfoTile"
import { Typography } from "@src/components/Typography"

export type ErrorDialogProps = {
    closeDialogCallback?: () => void
}

export const ErrorDialog: React.FC<ErrorDialogProps> = () => {

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Something went wrong
                </DialogTitle>
            </DialogHeader>
            <FlexDiv horizontal={false} className="justify-center items-center">
                <FlexItem>
                    <AppInfoTile tileType={TileType.Error} size={96}/>
                </FlexItem>
                <FlexItem>
                    <Typography variant="body" className="text-center" color="error">
                        Please try again later.
                    </Typography>
                </FlexItem>
            </FlexDiv>
        </DialogContent>
    )
}