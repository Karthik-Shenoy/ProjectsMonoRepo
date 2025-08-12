import { ActiveRecallQuestion } from "src/Services/ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

export interface QuestionCardProps extends ActiveRecallQuestion {
    className?: string;
    userAnswers: number[];
    setUserAnswers: (selectedAnswers: number[]) => void;
    isFinalized: boolean;
}
