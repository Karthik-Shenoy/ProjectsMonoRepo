import { FlexDiv } from "@src/components/FlexBox"
import { useTaskViewContext } from "../../contexts/TaskViewContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/components/ui/table"
import { CircleX, SquareCheckBig } from "lucide-react"
import { Typography } from "@src/components/Typography"
import { AsyncStatusHandlerWrapper } from "../Shared"

export const TaskResultPane: React.FC<{}> = () => {
    const { taskResultFetchState } = useTaskViewContext();
    const { data: taskResult } = taskResultFetchState;

    return (
        <FlexDiv horizontal={false} className={`w-full h-full bg-background rounded-lg ${taskResult ? "justify-start p-6" : "justify-center"} items-center gap-y-3`}>
            <AsyncStatusHandlerWrapper
                {...taskResultFetchState}
                loadingStateString="Getting Results..."
                noDataStateString="Please submit your solution to view results!">
                <>
                    <FlexDiv className="w-full justify-items-start">
                        <Typography variant="subheading" className="">Test Results</Typography>
                    </FlexDiv>
                    <Table className="border-2 border-accent">
                        <TableHeader>
                            <TableHead>Test</TableHead>
                            <TableHead>Result</TableHead>
                        </TableHeader>
                        <TableBody>
                            {taskResult?.testResults?.map((result) => {
                                return (
                                    <TableRow>
                                        <TableCell className="break-words whitespace-normal">
                                            {result.testName}
                                        </TableCell>
                                        <TableCell>
                                            {result.isSuccessful ? <SquareCheckBig size={16} className="text-green-700" /> : <CircleX size={16} className="text-red-700" />}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </>
            </AsyncStatusHandlerWrapper>
        </FlexDiv>
    )
}

