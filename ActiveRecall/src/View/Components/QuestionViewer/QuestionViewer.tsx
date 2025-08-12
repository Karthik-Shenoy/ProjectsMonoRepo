import * as React from "react";
import { FlexDiv, FlexItem } from "../FlexBox";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Button } from "@shadcn/components/ui/button";
import { ActiveRecallQuestion } from "src/Services/ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

interface QuestionViewerProps {
    questions: ActiveRecallQuestion[];
    userAnswers: number[][];
    isReadOnly?: boolean;
    onAnswerChange?: (questionIndex: number, selectedAnswer: number[]) => void;
    showNavigation?: boolean;
    showCorrectAnswers?: boolean; // New prop to show correct answers in read-only mode
}

export const QuestionViewer: React.FC<QuestionViewerProps> = ({
    questions,
    userAnswers,
    isReadOnly = false,
    onAnswerChange,
    showNavigation = true,
    showCorrectAnswers = false
}) => {
    const [currQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);

    const handleAnswerChange = (selectedAnswer: number[]) => {
        if (onAnswerChange && !isReadOnly) {
            onAnswerChange(currQuestionIndex, selectedAnswer);
        }
    };

    return (
        <FlexDiv className="gap-2 justify-center items-center" horizontal={false}>
            <FlexDiv horizontal={true} className="p-4 gap-4">
                {showNavigation && (
                    <FlexItem className="w-1/12 flex flex-col justify-center items-center">
                        <Button 
                            variant={"ghost"} 
                            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={currQuestionIndex === 0}
                        >
                            <ChevronLeftCircle />
                        </Button>
                    </FlexItem>
                )}
                
                <FlexItem className={showNavigation ? "w-10/12" : "w-full"}>
                    <QuestionCard
                        key={currQuestionIndex}
                        question={questions[currQuestionIndex].question}
                        choices={questions[currQuestionIndex].choices}
                        answers={questions[currQuestionIndex].answers}
                        userAnswers={userAnswers[currQuestionIndex] || []}
                        setUserAnswers={handleAnswerChange}
                        isFinalized={isReadOnly && showCorrectAnswers}
                        className="w-[450px] h-[340px]"
                    />
                </FlexItem>
                
                {showNavigation && (
                    <FlexItem className="w-1/12 flex flex-col justify-center items-center">
                        <Button 
                            variant={"ghost"} 
                            onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                            disabled={currQuestionIndex === questions.length - 1}
                        >
                            <ChevronRightCircle />
                        </Button>
                    </FlexItem>
                )}
            </FlexDiv>
            
            {/* Question counter */}
            <FlexItem className="w-20 flex justify-center rounded-md border-[0.5px] border-foreground">
                <span className="text-md font-semibold">
                    {currQuestionIndex + 1} of {questions.length}
                </span>
            </FlexItem>
        </FlexDiv>
    );
};
