import { ActiveRecallQuestion, ActiveRecallSession } from "src/Services/ActiveRecallStoreService";
import { BaseScreenProps } from "src/ViewControllerInterop/SharedTypes";
import { ScreenNames } from "src/ViewControllerInterop/SharedTypes";

export interface PracticeScreenProps extends BaseScreenProps, ActiveRecallSession {
    id: ScreenNames.Practice;
    onAnswerSubmit: (index: number, answer: number[]) => void;
    onFinalSubmit: () => void;
}
