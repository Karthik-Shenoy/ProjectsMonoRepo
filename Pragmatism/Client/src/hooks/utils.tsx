import { useLocation } from "react-router"

export enum AppLocation {
    HomePage = "/",
    TasksPage = "/tasks",
    TaskViewPage = "/tasks/:taskId",
}

export const useCurrentLocation = () => {
    const location = useLocation()
    const currentPath = location.pathname
    return currentPath as AppLocation
}