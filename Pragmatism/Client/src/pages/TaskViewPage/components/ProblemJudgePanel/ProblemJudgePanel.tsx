import { TabsContent } from "@shadcn/components/ui/tabs";
import { FlexDiv } from "@src/components/FlexBox";
import { TabList, TabProps } from "@src/components/TabList/TabList";
import { BugIcon, FlaskConical, NotebookText } from "lucide-react";
import * as React from "react"
import { ProblemDescription } from "../ProblemDescription";
import { TaskResultPane } from "../TaskResultPane";
import { DebugLogsPanel } from "../DebugLogsPanel/DebugLogsPanel";

export enum ProblemJudgePanelTabs {
    Description = "Description",
    Result = "Results",
    DebugLogs = "Debug Logs"
}

export const ProblemJudgePanel: React.FC<{}> = () => {

    const tabs: TabProps[] = [
        {
            icon: <NotebookText />,
            label: ProblemJudgePanelTabs.Description
        },
        {
            icon: <FlaskConical />,
            label: ProblemJudgePanelTabs.Result
        },
        {
            icon: <BugIcon />,
            label: ProblemJudgePanelTabs.DebugLogs
        }
    ]

    return (
        // outer div for positioning
        <div className="h-full w-full pl-2 py-3">
            <FlexDiv horizontal={false} className="h-full w-full px-4 py-2 rounded-xl bg-accent">
                <TabList tabs={tabs} className="w-full h-full" defaultValue={ProblemJudgePanelTabs.Description}>
                    <TabsContent value={ProblemJudgePanelTabs.Description}>
                        <ProblemDescription />
                    </TabsContent>
                    <TabsContent value={ProblemJudgePanelTabs.Result}>
                        <TaskResultPane />
                    </TabsContent>
                    <TabsContent value={ProblemJudgePanelTabs.DebugLogs}>
                        <DebugLogsPanel />
                    </TabsContent>
                </TabList>

            </FlexDiv>
        </div>
    )
}