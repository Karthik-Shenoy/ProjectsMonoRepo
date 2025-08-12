import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@shadcn/components/ui/card"
import { QuestionCardProps } from "./QuestionCard.props";
import { ChoiceTile, ChoiceTileVariant } from "../ChoiceTile";
import { useMCQ } from "./QuestionCardHooks";
import { FlexDiv } from "../FlexBox";
import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/components/ui/button";

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, choices, className, setUserAnswers, userAnswers, isFinalized, answers }) => {
    const [selectedAnswers, onMcqCheckedChange] = useMCQ(userAnswers);

    React.useEffect(() => {
        setUserAnswers(selectedAnswers);
    }, [selectedAnswers]);

    return (
        <Card className={cn(`${isFinalized ? "pointer-events-none" : ""} border-[0.5px] border-foreground overflow-y-auto`, className)}>
            <CardHeader className="text-lg">{question}</CardHeader>
            <CardContent>
                {
                    <FlexDiv horizontal={false} className="gap-y-4">
                        {
                            choices.map((choice, index) => {
                                let variant = ChoiceTileVariant.default;
                                
                                if (isFinalized && answers) {
                                    // Show the correct answers and user's selected answers with appropriate variants
                                    if (selectedAnswers.includes(index)) {
                                        // User selected this answer
                                        variant = answers.includes(index) ? ChoiceTileVariant.correct : ChoiceTileVariant.incorrect;
                                    } else if (answers.includes(index)) {
                                        // This is a correct answer that user didn't select
                                        variant = ChoiceTileVariant.correct;
                                    }
                                }
                                
                                const onCheckedChange = (checked: boolean) => {
                                    onMcqCheckedChange(index, checked);
                                };
                                
                                // In finalized mode, show correct answers even if user didn't select them
                                const shouldShowChecked = isFinalized 
                                    ? (userAnswers && userAnswers.includes(index))
                                    : selectedAnswers.includes(index);
                                
                                return (
                                    <ChoiceTile 
                                        key={index} 
                                        onCheckedChange={onCheckedChange} 
                                        label={choice} 
                                        checked={shouldShowChecked}
                                        variant={variant}
                                    />
                                )
                            })
                        }
                    </FlexDiv>
                }

            </CardContent>
            <CardFooter>

            </CardFooter>
        </Card>
    );
}