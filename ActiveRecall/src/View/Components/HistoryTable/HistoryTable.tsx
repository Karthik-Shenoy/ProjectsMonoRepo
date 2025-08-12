import * as React from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@shadcn/components/ui/table";
import { Button } from "@shadcn/components/ui/button";
import { Card, CardContent } from "@shadcn/components/ui/card";
import { Trash2, Eye } from "lucide-react";
import { ActiveRecallSession } from "src/Services/ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";

interface HistoryTableProps {
    sessions: ActiveRecallSession[];
    onSessionSelect: (session: ActiveRecallSession) => void;
    onDeleteSession: (session: ActiveRecallSession) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
    sessions,
    onSessionSelect,
    onDeleteSession
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateScore = (session: ActiveRecallSession) => {
        if (!session.questions || session.questions.length === 0) return "0%";
        
        let correctAnswers = 0;
        session.questions.forEach((question, index) => {
            const userAnswer = session.userAnswers[index] || [];
            const correctAnswer = question.answers;
            
            // Check if arrays are equal
            if (userAnswer.length === correctAnswer.length && 
                userAnswer.every(ans => correctAnswer.includes(ans))) {
                correctAnswers++;
            }
        });
        
        const percentage = Math.round((correctAnswers / session.questions.length) * 100);
        return `${percentage}%`;
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.lastModifiedDate}>
                                <TableCell className="font-medium">
                                    {formatDate(session.lastModifiedDate)}
                                </TableCell>
                                <TableCell>
                                    {session.questions?.length || 0}
                                </TableCell>
                                <TableCell>
                                    <span className={`font-semibold ${
                                        parseInt(calculateScore(session)) >= 70 
                                            ? 'text-green-600' 
                                            : parseInt(calculateScore(session)) >= 50
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                    }`}>
                                        {calculateScore(session)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        session.isPending 
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                        {session.isPending ? 'Pending' : 'Completed'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onSessionSelect(session)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDeleteSession(session)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
