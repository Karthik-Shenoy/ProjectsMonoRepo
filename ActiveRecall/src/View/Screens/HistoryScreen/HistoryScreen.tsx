import * as React from "react";
import { HistoryScreenProps } from "./HistoryScreen.props";
import { HistoryTable } from "../../Components/HistoryTable/HistoryTable";
import { SessionSummaryScreen } from "../SessionSummaryScreen/SessionSummaryScreen";
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
import { Download, ArrowLeft, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { ActiveRecallSession } from "src/Services/ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";
import { ScreenNames } from "src/ViewControllerInterop/SharedTypes";
import { FlexDiv } from "src/View/Components/FlexBox";

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
    sessions,
    onSessionSelect,
    onDeleteSession,
    onExportHistory
}) => {
    const [selectedSession, setSelectedSession] = React.useState<ActiveRecallSession | null>(null);
    const [currentView, setCurrentView] = React.useState<'history' | 'summary'>('history');

    const handleSessionSelect = (session: ActiveRecallSession) => {
        setSelectedSession(session);
        setCurrentView('summary');
        onSessionSelect(session);
    };

    const handleBackToHistory = () => {
        setSelectedSession(null);
        setCurrentView('history');
    };

    const renderBreadcrumbs = () => {
        return (
            <Breadcrumb className="mb-6">
                <BreadcrumbList className="gap-0.5!">
                    <BreadcrumbItem>
                        <BreadcrumbLink 
                            onClick={() => handleBackToHistory()}
                            className="cursor-pointer flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            History
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {currentView === 'summary' && selectedSession && (
                        <>
                            <BreadcrumbSeparator >
                                <FlexDiv className="items-center justify-center" horizontal={false}>
                                    <ChevronRight className="w-4 h-4" />
                                </FlexDiv>
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Session Summary
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        );
    };

    const renderHistoryView = () => {
        if (sessions.length === 0) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <Card className="w-96">
                        <CardHeader>
                            <CardTitle className="text-center">No History Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">
                                Complete some practice sessions to see your history here.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="flex-1 w-full max-w-6xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Session History</h1>
                    <Button onClick={onExportHistory} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export History
                    </Button>
                </div>

                <HistoryTable
                    sessions={sessions}
                    onSessionSelect={handleSessionSelect}
                    onDeleteSession={onDeleteSession}
                />
            </div>
        );
    };

    const renderSummaryView = () => {
        if (!selectedSession) return null;

        return (
            <div className="flex-1 w-full max-w-6xl mx-auto p-4">
                <FlexDiv className="flex items-center justify-start" horizontal>
                    
                    <h1 className="text-2xl font-bold">Session Summary</h1>
                </FlexDiv>

                <SessionSummaryScreen
                    id={ScreenNames.History}
                    session={selectedSession}
                    onBack={handleBackToHistory}
                />
            </div>
        );
    };

    return (
        <div className="flex-1 w-full">
            {renderBreadcrumbs()}
            {currentView === 'history' ? renderHistoryView() : renderSummaryView()}
        </div>
    );
};
