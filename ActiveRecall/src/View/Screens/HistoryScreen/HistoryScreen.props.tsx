import { BaseScreenProps } from "src/ViewControllerInterop/SharedTypes";
import { ActiveRecallSession } from "src/Services/ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

export interface HistoryScreenProps extends BaseScreenProps {
    sessions: ActiveRecallSession[];
    onSessionSelect: (session: ActiveRecallSession) => void;
    onDeleteSession: (session: ActiveRecallSession) => void;
    onExportHistory: () => void;
}
