import bootstrapper from "./bootstrapper";

export const HistoryManagerServiceBootStrapper = {
    default: bootstrapper
};

export { HistoryManagerService } from "./HistoryManagerService";
export type { IHistoryManagerService } from "./Contracts/IHistoryManagerService";
