import * as React from "react"
import { Button } from "@shadcn/components/ui/button";
import { useTheme } from "@src/contexts/AppThemeContext/AppThemeContext"
import { CloudUpload, Code2 } from "lucide-react"
import { CustomEditorFallback } from "./CustomEditorFallback";
import { type MonacoCodeEditor } from "./MonacoEditorWrapper";
import { DTO } from "@src/dto/dto";
import { useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext";
import { useTaskViewContext } from "../../contexts/TaskViewContext";
import { ProblemJudgePanelTabs } from "../ProblemJudgePanel/ProblemJudgePanel";

const EditorLazy = React.lazy(() =>
    import("./MonacoEditorWrapper").then((module) => {
        if (!module.MonacoEditorWrapper) {
            throw Error("TaskViewPage.CustomEditor: MonacoEditorWrapper Component does not exist in the module ./MonacoEditorWrapper")
        }
        return { default: module.MonacoEditorWrapper }
    })
)

export const CustomEditor: React.FC<{}> = () => {
    const editorRef = React.useRef<MonacoCodeEditor>(null);
    const themeContext = useTheme();
    const { userName } = useAppAuthContext();
    const {
        taskDataFetchState,
        taskResultFetchState,
        taskDir,
        setTaskResultFetchState,
        setTaskData,
        setJudgePanelTab
    } = useTaskViewContext();
    
    const { isFetching: isFetchingTaskData, data: taskFetchData } = taskDataFetchState;
    const taskFiles = taskFetchData?.taskFiles;

    const taskSubmitControllerRef = React.useRef<AbortController>(null)

    const handleEditorDidMount = (editor: MonacoCodeEditor) => {
        editorRef.current = editor;
    }

    const handleEditorDataChanged = (editor: MonacoCodeEditor) => {
        setTaskData((previousState) => {
            if (!previousState) {
                return undefined;
            }

            const newTaskFiles = [...(previousState.taskFiles || [])]

            newTaskFiles[0].content = editor.getValue()

            return {
                ...previousState,
                data: {
                    taskDir: previousState.taskDir || "",
                    taskFiles: newTaskFiles
                }
            }

        })
    }

    const onSubmit = async () => {
        if (!editorRef?.current || !userName) {
            return;
        }
        const code = editorRef.current.getValue();

        const taskSubmitRequest: DTO.TaskSubmitRequest = {
            userName,
            taskFiles: [
                {
                    fileName: taskFiles && taskFiles[0]?.fileName || "",
                    content: code,
                    fileType: taskFiles && taskFiles[0].fileType || DTO.FileType.TASK
                },
            ],
            taskDir: taskDir || "",
            language: ""
        }

        setTaskResultFetchState({
            isFetching: true,
            error: null
        })

        setJudgePanelTab(ProblemJudgePanelTabs.Result)

        try {
            // abort the previous request if any
            taskSubmitControllerRef.current?.abort();

            taskSubmitControllerRef.current = new AbortController()
            const res = await fetch(`${__API_URL__}/tasks/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskSubmitRequest),
                signal: taskSubmitControllerRef.current.signal
            })

            const taskResult = (await res.json()) as DTO.TaskSubmitResponse
            setTaskResultFetchState({
                isFetching: false,
                error: null,
                data: taskResult
            })
        } catch (error) {
            setTaskResultFetchState({
                isFetching: false,
                error: error as Error
            })
            return;
        }

    }

    const content = taskFiles && taskFiles.length > 0 ? taskFiles[0]?.content : ""
    const contracts = taskFiles && taskFiles.length > 1 ? taskFiles[1]?.content : ""

    return (
        <div className="flex-col flex w-full h-full">
            <div className="flex flex-row gap-x-2 items-center sm:py-2">
                <div className="flex flex-row items-center gap-x-2 sm:ml-1 bg-accent w-fit px-4 sm:py-0.5 rounded-2xl cursor-default">
                    <Code2 className="sm:w-4 h-4" />
                    <h4 className="sm:text-xs">Code</h4>
                </div>
                <div className="ml-auto">
                    <Button
                        className={`text-xs py-1 h-6 px-2 font-bold ${taskResultFetchState.isFetching ? "text-accent cursor-none" : "text-green-500 cursor-pointer"} mr-4  hover:text-white hover:bg-green-800`}
                        variant={"secondary"}
                        onClick={taskResultFetchState.isFetching ? undefined : onSubmit}>
                        <CloudUpload />
                        Submit
                    </Button>
                </div>
            </div>
            {
                isFetchingTaskData ?
                    <CustomEditorFallback />
                    :
                    <React.Suspense fallback={
                        <CustomEditorFallback />
                    }>
                        <EditorLazy
                            onMount={handleEditorDidMount}
                            className="grow"
                            theme={themeContext.theme === "dark" ? "vs-dark" : "light"}
                            language="typescript"
                            value={content}
                            extraLibContent={contracts}
                            onChange={handleEditorDataChanged}
                        />
                    </React.Suspense>
            }
        </div>
    )
}