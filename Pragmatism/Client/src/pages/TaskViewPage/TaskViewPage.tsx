import { CustomEditor } from "./components/CustomEditor"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@shadcn/components/ui/resizable"
import * as React from "react"
import { LoginDialogBlocking } from "@src/components/DialogSurfaces/LoginDialog/LoginDialogBlocking"
import { TaskViewContextProvider } from "./contexts/TaskViewContext"
import { ErrorBoundary } from "@src/components/ErrorBoundary/ErrorBoundary"
import { ProblemJudgePanel } from "./components/ProblemJudgePanel/ProblemJudgePanel"




export const TaskView: React.FC<{}> = () => {


    return (
        <ErrorBoundary>
            <TaskViewContextProvider>
                <div className="relative flex flex-col items-center justify-center h-full overflow-hidden bg-gradient-to-br pt-15 max-h-screen">
                    <LoginDialogBlocking />
                    <ResizablePanelGroup direction="horizontal" className="grow">
                        <ResizablePanel>
                            <ProblemJudgePanel />
                        </ResizablePanel>
                        <ResizableHandle className="relative flex flex-col justify-center items-center w-4 bg-transparent rounded-md" withHandle={true} />
                        <ResizablePanel>
                            <CustomEditor />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </TaskViewContextProvider>
        </ErrorBoundary>
    )
} 