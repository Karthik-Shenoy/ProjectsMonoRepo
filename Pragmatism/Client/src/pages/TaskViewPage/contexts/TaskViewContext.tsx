import * as React from "react";
import { DTO } from "@src/dto/dto";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

export type FetchState<T> = {
    isFetching: boolean;
    error: Error | null
    data?: T
}

export type TaskDataFetchState = FetchState<DTO.GetTaskResponse>;
export type TaskResultFetchState = FetchState<DTO.TaskSubmitResponse>

export type TaskViewContextType = {
    taskId?: string;
    taskDir?: string;
    taskDataFetchState: TaskDataFetchState;
    taskResultFetchState: TaskResultFetchState;
};

export type TaskViewContextCallbacks = {
    setTaskDataFetchState: React.Dispatch<React.SetStateAction<TaskDataFetchState>>
    setTaskResultFetchState: (fetchState: TaskResultFetchState) => void
};

export const TaskViewContext = React.createContext<
    (TaskViewContextType & TaskViewContextCallbacks) | undefined
>(undefined);

export const TaskViewContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const params = useParams<{ taskId: string }>()
    const [taskDataFetchState, setTaskDataFetchState] = React.useState<TaskDataFetchState>({
        error: null,
        isFetching: false
    })

    const [taskResultFetchState, setTaskResultFetchState] = React.useState<TaskResultFetchState>({
        error: null,
        isFetching: false
    })

    const {
        isPending: _isPending,
        error: err,
        isFetching: isFetchingTaskData,
        data: getTasksResponse,
    } =
        useQuery({
            queryKey: ["tasks", params.taskId],
            queryFn: async () => {
                const response = await fetch(`${__API_URL__}/tasks/${params.taskId}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                let getTaskResponse = (await response.json()) as DTO.GetTaskResponse;
                return getTaskResponse;
            },
        })

    React.useEffect(() => {
        setTaskDataFetchState({
            isFetching: isFetchingTaskData,
            error: err,
            data: getTasksResponse
        })
    }, [isFetchingTaskData, getTasksResponse, err])

    const value: TaskViewContextType & TaskViewContextCallbacks = {
        taskId: params.taskId,
        taskDir: taskDataFetchState.data?.taskDir,
        taskResultFetchState,
        taskDataFetchState,
        setTaskDataFetchState,
        setTaskResultFetchState
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