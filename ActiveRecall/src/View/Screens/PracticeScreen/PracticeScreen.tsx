import * as React from "react";
import { FlexDiv, FlexItem } from "../../Components/FlexBox";
import { QuestionCard } from "../../Components/QuestionCard/QuestionCard";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { PracticeScreenProps } from "./PracticeScreen.props";

import { Button } from "@shadcn/components/ui/button"

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ questions, userAnswers, onAnswerSubmit, onFinalSubmit, isPending }) => {
    const [currQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);

    const areAllQuestionsAnswered = userAnswers.every((answer) => answer.length > 0);

    return (

        <FlexDiv className="gap-2 justify-center items-center" horizontal={false}>
            <FlexDiv horizontal={true} className="p-4 gap-4">
                <FlexItem className="w-1/12 flex flex-col justify-center items-center">
                    <Button variant={"ghost"} onClick={() => {
                        setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
                    }}>
                        <ChevronLeftCircle scale={192} />
                    </Button>
                </FlexItem>
                <FlexItem className="w-10/12">
                    <QuestionCard
                        key={currQuestionIndex}
                        question={questions[currQuestionIndex].question}
                        choices={questions[currQuestionIndex].choices}
                        answers={questions[currQuestionIndex].answers}
                        userAnswers={userAnswers[currQuestionIndex]}
                        setUserAnswers={(selectedAnswer) => {
                            onAnswerSubmit(currQuestionIndex, selectedAnswer);
                        }}
                        isFinalized={!isPending}
                        className="w-[450px] h-[340px]"
                    />
                </FlexItem>
                <FlexItem className="w-1/12 flex flex-col justify-center items-center">
                    <Button variant={"ghost"} onClick={() => {
                        setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
                    }}>
                        <ChevronRightCircle scale={192} />
                    </Button>
                </FlexItem>

            </FlexDiv>
            {/* show the question counts */}
            <FlexItem className="w-20 flex justify-center rounded-md b-[0.5px] border-foreground">
                <span className="text-md font-semibold">
                    {currQuestionIndex + 1} of {questions.length}
                </span>
            </FlexItem>
            <FlexDiv horizontal className="w-full justify-end items-center">
                <Button variant="outline" disabled={!areAllQuestionsAnswered} className="w-32" onClick={onFinalSubmit}>
                    Submit
                </Button>
            </FlexDiv>
        </FlexDiv>

    );
}
