import * as React from "react"
import { TaskDataFetchState, TaskResultFetchState } from "../../contexts/TaskViewContext"
import { AppInfoTile, TileType } from "@src/components/AppInfoTile"
import { FlexDiv, FlexItem } from "@src/components/FlexBox"
import BasicSpinner from "@src/components/Loaders/BasicSpinner"
import { Typography } from "@src/components/Typography"


export type AsyncStatusHandlerWrapperStringProps = {
    loadingStateString: string;
    noDataStateString: string;
    errorStateString?: string;
}

export type AsyncStatusHandlerWrapperProps = {
    dataEmptyCheckCallback?: (data: any) => boolean;
}

export const AsyncStatusHandlerWrapper: React.FC<
    React.PropsWithChildren<
        (TaskResultFetchState | TaskDataFetchState)
        & AsyncStatusHandlerWrapperStringProps
        & AsyncStatusHandlerWrapperProps
    >
> =
    ({ isFetching, error, data, children, loadingStateString, noDataStateString, errorStateString }) => {
        if (isFetching) {
            return (
                <FlexDiv horizontal={false} className="justify-center items-center gap-x-2">
                    <BasicSpinner className="w-10 h-10" />
                    <FlexItem>
                        <Typography variant="caption">
                            {loadingStateString}
                        </Typography>
                    </FlexItem>
                </FlexDiv>
            )
        } else if (error != null) {
            return (
                <AppInfoTile tileType={TileType.Error} description={errorStateString || "Something went wrong!"} size={96} />
            )
        } else if (data === undefined) {

            return (
                <AppInfoTile tileType={TileType.NoData} description={noDataStateString} size={96} />
            )
        } else {
            return (
                <>
                    {children}
                </>
            )
        }
    }