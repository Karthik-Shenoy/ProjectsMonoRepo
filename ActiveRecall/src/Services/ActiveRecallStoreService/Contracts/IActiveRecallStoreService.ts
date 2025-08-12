import { ActiveRecallData, ActiveRecallSession } from "./ActiveRecallStoreContracts";

export interface IActiveRecallStoreService {
    getActiveRecallDataIfExists(): Promise<ActiveRecallData>;
    validateAndGetActiveRecallSessionData(folderKey: string): Promise<ActiveRecallSession[]>;
    validateAndSaveActiveRecallSessionData(folderKey: string, sessionHistory: ActiveRecallSession[]): Promise<void>;
    getFolderKey(): string;
}
