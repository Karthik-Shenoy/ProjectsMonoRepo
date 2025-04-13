import * as React from "react";
import { DTO } from "@src/dto/dto";
import { useParams } from "react-router";
import { ProblemJudgePanelTabs } from "../components/ProblemJudgePanel/ProblemJudgePanel";
import { SetTaskDataCallbackFn, useTaskData } from "../hooks/UseTaskData";



export type FetchState<T> = {
    isFetching: boolean;
    error: Error | null
    data?: T
}

export type TaskDataFetchState = FetchState<DTO.GetTaskResponse>;
export type TaskResultFetchState = FetchState<DTO.TaskSubmitResponse>;

export type SetTaskDataFetchStateWrapper = (stateUpdate: TaskDataFetchState | ((prevState: TaskDataFetchState) => TaskDataFetchState)) => void;

export type TaskViewContextType = {
    taskId?: number;
    taskDir?: string;
    taskDataFetchState: TaskDataFetchState;
    taskResultFetchState: TaskResultFetchState;
    judgePanelTab: ProblemJudgePanelTabs;
};

export type TaskViewContextCallbacks = {
    // setTaskDataFetchState: React.Dispatch<React.SetStateAction<TaskDataFetchState>>
    setTaskData: SetTaskDataCallbackFn;
    setTaskResultFetchState: (fetchState: TaskResultFetchState) => void
    setJudgePanelTab: React.Dispatch<React.SetStateAction<ProblemJudgePanelTabs>>
};

export const TaskViewContext = React.createContext<
    (TaskViewContextType & TaskViewContextCallbacks) | undefined
>(undefined);

export const TaskViewContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const params = useParams<{ taskId: string }>()

    const [judgePanelTab, setJudgePanelTab] = React.useState<ProblemJudgePanelTabs>(ProblemJudgePanelTabs.Description)

    const [taskResultFetchState, setTaskResultFetchState] = React.useState<TaskResultFetchState>({
        error: null,
        isFetching: false
    })


    const {
        isPending: _isPending,
        error: errTaskData,
        isFetching: isFetchingTaskData,
        data: taskData,
        setTaskData
    } =
        useTaskData(params.taskId)

    const value: TaskViewContextType & TaskViewContextCallbacks = {
        taskId: parseInt(params.taskId || "-1"),
        judgePanelTab,
        taskDir: taskData?.taskDir,
        taskResultFetchState,
        taskDataFetchState: {
            isFetching: isFetchingTaskData,
            error: errTaskData,
            data: taskData
        },
        setTaskResultFetchState,
        setTaskData,
        setJudgePanelTab,
    }

    return (
        <TaskViewContext.Provider value={value}>
            {children}
        </TaskViewContext.Provider>
    )
};

export const useTaskViewContext = (): TaskViewContextType & TaskViewContextCallbacks => {
    const context = React.useContext(TaskViewContext);
    if (!context) {
        throw new Error("useTaskViewContext must be used within a TaskViewProvider");
    }
    return context;
};


export const TaskPaneContextConsumer: React.FC<{ children: (taskViewContext: TaskViewContextType & TaskViewContextCallbacks) => React.ReactNode }> = ({ children }) => {
    const context = React.useContext(TaskViewContext);

    if (!context) {
        throw new Error("TaskPaneContextConsumer must be used within a TaskViewProvider");
    }

    return (
        <>
            {children(context)}
        </>
    )
}