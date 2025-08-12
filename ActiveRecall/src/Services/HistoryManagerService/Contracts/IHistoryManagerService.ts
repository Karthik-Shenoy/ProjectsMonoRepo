import { ActiveRecallSession } from "../../ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

export interface IHistoryManagerService {
    getSessionHistory(): Promise<ActiveRecallSession[]>;
    showHistoryScreen(): Promise<void>;
    addSessionToHistory(session: ActiveRecallSession): Promise<void>;
    updateSessionInHistory(session: ActiveRecallSession): Promise<void>;
}
