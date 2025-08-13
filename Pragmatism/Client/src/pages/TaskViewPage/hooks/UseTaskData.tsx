import { DTO } from "@src/dto/dto";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { TASK_DATA_KEY } from "../TaskViewPageSharedConstants"

export type TaskDataState = DTO.GetTaskResponse | undefined;
export type SetTaskDataCallbackFn = React.Dispatch<React.SetStateAction<TaskDataState>>

export const useTaskData = (taskId: string | undefined) => {
    const [taskData, setTaskData] = React.useState<TaskDataState>(() => {
        const taskData = localStorage.getItem(TASK_DATA_KEY)
        if (taskData) {
            return JSON.parse(taskData) as DTO.GetTaskResponse
        }
        return undefined
    })

    const setTaskDataWrapper: SetTaskDataCallbackFn = React.useCallback((taskDataStateOrUpdaterFn) => {
        if (typeof taskDataStateOrUpdaterFn === "function") {
            const newTaskData = taskDataStateOrUpdaterFn(taskData)
            setTaskData(newTaskData)
            if (!newTaskData) {
                return
            }
            localStorage.setItem(TASK_DATA_KEY, JSON.stringify(newTaskData))
        } else {
            setTaskData(taskDataStateOrUpdaterFn)
            if (!taskDataStateOrUpdaterFn) {
                return
            }
            localStorage.setItem(TASK_DATA_KEY, JSON.stringify(taskDataStateOrUpdaterFn))
        }
    }, [taskData])

    const {
        isPending,
        error,
        isFetching,
        data,
    } =
        useQuery({
            queryKey: ["tasks", taskId],
            queryFn: async () => {
                const response = await fetch(`${__API_URL__}/tasks/${taskId}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                let getTaskResponse = (await response.json()) as DTO.GetTaskResponse;
                return getTaskResponse;
            },
            initialData: taskData,
        })

    React.useEffect(() => {
        if (data) {
            setTaskDataWrapper(data)
        }
    }, [data])

    return {
        isPending,
        error,
        isFetching,
        data,
        setTaskData: setTaskDataWrapper
    }
} 