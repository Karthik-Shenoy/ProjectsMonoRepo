import { DTO } from "@src/dto/dto";
import { useQuery } from "@tanstack/react-query"
import * as React from "react"
import ProblemCard from "./components/ProblemCard/ProblemCard";
import { GridDiv, GridItem } from "@src/components/GridBox";
import { Typography } from "@src/components/Typography";
import { FlexDiv, FlexItem } from "@src/components/FlexBox";
import { ErrorDialogBlocking } from "@src/components/DialogSurfaces/ErrorDialog";
import { ProblemCardSkeleton } from "./components/ProblemCard/ProblemCardSkeleton";


export const TasksPage: React.FC<{}> = () => {
    const {
        isPending,
        error,
        isFetching,
        data: problems,
    } =
        useQuery({
            queryKey: ["problems"],
            queryFn: async () => {
                const response = await fetch(`${__API_URL__}/tasks`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                let problems = await response.json()
                return problems as DTO.Task[];
            },
            retry: 2
        })

    return (
        <>
            <ErrorDialogBlocking showErrorDialog={error != null} />
            <div className="relative flex flex-col items-center justify-center h-full overflow-hidden bg-gradient-to-br from-purple-900 via-background to-purple-900">
                <FlexDiv horizontal={false} className="w-full h-full pl-20 pt-20 cursor-default">
                    <FlexItem className="w-full">
                        <Typography variant="title" className="text-white text-4xl font-bold mb-4">
                            Problems
                        </Typography>
                    </FlexItem>
                    <GridDiv className="lg:grid-cols-3 grid-cols-2 w-full h-full pb-4 space-x-1">
                        {isFetching || isPending || error != null ?
                            Array.from({ length: 2 }).map(() => (
                                <GridItem>
                                    <ProblemCardSkeleton />
                                </GridItem>
                            ))
                            :
                            problems?.map((problemProps) => (
                                <GridItem>
                                    <ProblemCard {...problemProps} />
                                </GridItem>
                            ))}
                    </GridDiv>
                </FlexDiv>
            </div>
        </>
    )
}