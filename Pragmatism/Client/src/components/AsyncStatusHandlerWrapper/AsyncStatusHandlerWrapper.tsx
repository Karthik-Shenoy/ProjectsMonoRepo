import * as React from "react"
import { AppInfoTile, TileSize, TileType } from "@src/components/AppInfoTile"
import { FlexDiv, FlexItem } from "@src/components/FlexBox"
import BasicSpinner from "@src/components/Loaders/BasicSpinner"
import { Typography } from "@src/components/Typography"
import { cn } from "@shadcn/lib/utils"

export type AsyncStatusHandlerWrapperStringProps = {
    loadingStateString: string;
    noDataStateString: string;
    errorStateString?: string;
}

export type AsyncStatusHandlerWrapperProps = {
    tilesSize?: TileSize;
    spinnerClassName?: string;
}

export type AsyncState = {
    isFetching: boolean;
    error: Error | null
    data?: any
}

export const AsyncStatusHandlerWrapper: React.FC<React.PropsWithChildren<AsyncState & AsyncStatusHandlerWrapperStringProps & AsyncStatusHandlerWrapperProps>> =
    ({ isFetching, error, data, children, loadingStateString, noDataStateString, errorStateString, tilesSize, spinnerClassName }) => {
        if (isFetching) {
            return (
                <FlexDiv horizontal={false} className="justify-center items-center gap-x-2">
                    <BasicSpinner className={cn("w-10 h-10", spinnerClassName)} />
                    <FlexItem>
                        <Typography variant="caption">
                            {loadingStateString}
                        </Typography>
                    </FlexItem>
                </FlexDiv>
            )
        } else if (error != null) {
            return (
                <AppInfoTile tileType={TileType.Error} description={errorStateString || "Something went wrong!"} size={tilesSize || 96} />
            )
        } else if (!data) {

            return (
                <AppInfoTile tileType={TileType.NoData} description={noDataStateString} size={tilesSize || 96} />
            )
        } else {
            return (
                <>
                    {children}
                </>
            )
        }
    }