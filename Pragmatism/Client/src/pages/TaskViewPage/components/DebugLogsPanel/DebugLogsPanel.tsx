import { FlexDiv } from "@src/components/FlexBox"
import { Typography } from "@src/components/Typography"
import { useTaskViewContext } from "../../contexts/TaskViewContext"
import { AsyncStatusHandlerWrapper } from "../Shared"

export const DebugLogsPanel = () => {
    const { taskResultFetchState } = useTaskViewContext()
    const { data: taskResult, } = taskResultFetchState
    return (
        <FlexDiv
            horizontal={false}
            className={`w-full h-full bg-background rounded-lg ${taskResult ? "justify-start p-6" : "justify-center"} items-center gap-y-3 `}
        >
            <AsyncStatusHandlerWrapper {...taskResultFetchState} loadingStateString="Getting Debug Logs..." noDataStateString="Please submit your solution to view debug logs!">
                <FlexDiv className="w-full justify-items-start">
                    <Typography variant="subheading" className="">Debug logs</Typography>
                </FlexDiv>
                <FlexDiv horizontal={false} className="w-full h-[500px] lg:h-[400px] max-h-[500px] gap-y-3 overflow-y-auto border-2 border-accent rounded-xl p-4 dark-scrollbar">
                    <Typography variant="caption" className="break-words font-mono whitespace-pre-line" color="success">{taskResult?.dbgLogs}</Typography>
                </FlexDiv>
            </AsyncStatusHandlerWrapper>
        </FlexDiv>
    )
}

