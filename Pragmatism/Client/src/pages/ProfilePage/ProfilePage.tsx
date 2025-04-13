import { Progress } from "@shadcn/components/ui/progress"; // Assuming ShadCN UI provides a Progress component
import { Sidebar } from "@src/components/Sidebar"; // Assuming a Sidebar component exists
import { FlexDiv } from "@src/components/FlexBox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/components/ui/table";
import { Typography } from "@src/components/Typography";
import { SquareUser } from "lucide-react";
import { useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext";
import { useQuery } from "@tanstack/react-query";
import { DTO } from "@src/dto/dto";
import { AsyncStatusHandlerWrapper } from "@src/components/AsyncStatusHandlerWrapper";
import { Image } from "@src/components/Image";

export type ProfilePageUrlParams = {
    userId: string;
}

export const ProfilePage: React.FC<{}> = () => {
    // const { userId } = useParams<ProfilePageUrlParams>();
    const { userName, userProfilePictureUrl } = useAppAuthContext();

    const {
        isFetching,
        data,
        error,
    } = useQuery({
        queryKey: ["/users/solved_tasks"],
        queryFn: async () => {
            const response = await fetch(`${__API_URL__}/users/solved_tasks`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!response.ok) {
                throw new Error("status_code_" + response.status);
            }
            let solvedTasks = await response.json() as DTO.SolvedTask[];
            return solvedTasks;
        }
    })

    return (
        <div className="flex h-full bg-gradient-to-bl from-purple-900/40 via-black to-purple-900/40 pt-[59px]">
            <Sidebar >
                <div className="flex-1 p-6">
                    {/* User Profile Section */}
                    <FlexDiv horizontal={false} className="items-center space-y-4 pb-4 border-b-2 border-accent">
                        {userProfilePictureUrl ? (
                            <Image
                                url={userProfilePictureUrl}
                                width={64}
                                height={64}
                                errorFallback={<SquareUser size={64} />}
                                className="rounded-full"
                            />
                        ) : (
                            <SquareUser size={64} />
                        )}
                        <div>
                            <h3 className="text-xl font-semibold text-white">{userName}</h3>
                        </div>
                    </FlexDiv>

                    <div className="mt-6">
                        <h2 className="desktop:text-xl font-semibold text-white">Solved Problems: {data?.length || 0} / 1</h2>
                        <Progress value={(data?.length || 0) * 100} max={1} className="mt-2" getValueLabel={(_value, _max) => {
                            return `solved ${_value}% of the problems`;
                        }} />
                    </div>
                </div>
            </Sidebar >

            {/* Main Content Area */}

            <FlexDiv horizontal={false} className={`p-6 gap-y-8 w-full h-full ${(isFetching || error) && "items-center justify-center"}`}>
                <AsyncStatusHandlerWrapper
                    loadingStateString="Getting Solved Problems ..."
                    noDataStateString="No Solved Problems"
                    {...{ isFetching, error, data }}
                    spinnerClassName="w-18 h-18"
                    tilesSize={128}
                >
                    <Typography variant="heading">
                        Solved Problems
                    </Typography>
                    <Table className="border-2 border-accent" >
                        <TableHeader className="border-b-1 border-accent">
                            <TableHead>Problem Name</TableHead>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.map((problem) => (
                                    <TableRow className="border-b-2 border-accent">
                                        <TableCell className="break-words whitespace-normal">
                                            {problem.title}
                                        </TableCell>

                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </AsyncStatusHandlerWrapper>
            </FlexDiv>

        </div>
    );
};