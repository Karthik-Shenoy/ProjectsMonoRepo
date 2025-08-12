import { ActiveRecallSession } from "../../ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

export interface IActiveRecallSessionManagerService {
    getCurrentSession(): Promise<ActiveRecallSession | undefined>;
    getSessionHistory(): Promise<ActiveRecallSession[]>;
    initializeSession(): Promise<void>;
}

export interface ISessionUpdateSubscriber {
    onSessionUpdate: (sessionHistory: ActiveRecallSession[]) => void;
}
