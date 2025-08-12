import * as React from "react";
import { SessionSummaryScreenProps } from "./SessionSummaryScreen.props";
import { QuestionViewer } from "../../Components/QuestionViewer/QuestionViewer";
import { FlexDiv, FlexItem } from "../../Components/FlexBox";
import { Button } from "@shadcn/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card";
import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from "@shadcn/components/ui/breadcrumb";
import { ArrowLeft, Calendar, Trophy, Target } from "lucide-react";

export const SessionSummaryScreen: React.FC<SessionSummaryScreenProps> = ({
    session,
    onBack
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateScore = () => {
        if (!session.questions || session.questions.length === 0) return { percentage: 0, correct: 0, total: 0 };
        
        let correctAnswers = 0;
        session.questions.forEach((question, index) => {
            const userAnswer = session.userAnswers[index] || [];
            const correctAnswer = question.answers;
            
            if (userAnswer.length === correctAnswer.length && 
                userAnswer.every(ans => correctAnswer.includes(ans))) {
                correctAnswers++;
            }
        });
        
        const percentage = Math.round((correctAnswers / session.questions.length) * 100);
        return { percentage, correct: correctAnswers, total: session.questions.length };
    };

    const scoreData = calculateScore();

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto p-4">

            {/* Session Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Session Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{formatDate(session.lastModifiedDate)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Score</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${
                            scoreData.percentage >= 70 
                                ? 'text-green-600' 
                                : scoreData.percentage >= 50
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}>
                            {scoreData.percentage}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {scoreData.correct} out of {scoreData.total} correct
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Questions</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{session.questions?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total questions attempted
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Questions Review */}
            {session.questions && session.questions.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Question Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuestionViewer
                            questions={session.questions}
                            userAnswers={session.userAnswers}
                            isReadOnly={true}
                            showNavigation={true}
                            showCorrectAnswers={true}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
