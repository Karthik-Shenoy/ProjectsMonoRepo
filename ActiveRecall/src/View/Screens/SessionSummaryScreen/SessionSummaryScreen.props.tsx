import { BaseScreenProps } from "src/ViewControllerInterop/SharedTypes";
import { ActiveRecallSession } from "src/Services/ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

export interface SessionSummaryScreenProps extends BaseScreenProps {
    session: ActiveRecallSession;
    onBack: () => void;
}
