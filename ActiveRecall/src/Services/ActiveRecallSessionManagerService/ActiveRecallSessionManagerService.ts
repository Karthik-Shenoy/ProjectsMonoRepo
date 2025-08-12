import { ScreenNames } from "src/ViewControllerInterop/SharedTypes";
import { IActiveRecallStoreService } from "../ActiveRecallStoreService";
import { ActiveRecallSession } from "../ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";
import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";
import { IPluginFacadeService } from "../PluginnFacadeService/Contracts/IPluginFacadeService";
import { IHistoryManagerService } from "../HistoryManagerService/Contracts/IHistoryManagerService";
import {
    IActiveRecallSessionManagerService,
    ISessionUpdateSubscriber,
} from "./Contracts/IActiveRecallSessionManagerService";
import { PracticeScreenProps } from "src/View/Screens/PracticeScreen/PracticeScreen.props";

/**
 * Service which takes care of underlying active recall session management.
 */
export class ActiveRecallSessionManagerService implements IActiveRecallSessionManagerService {
    private isInitialized: Promise<void>;
    private currentSession: ActiveRecallSession | undefined;
    private sessionUpdateSubscribers: ISessionUpdateSubscriber[];

    constructor(
        private store: IActiveRecallStoreService,
        private pluginFacadeService: IPluginFacadeService,
        private app: IAppFacadeService,
        private historyManager: IHistoryManagerService
    ) {
        this.isInitialized = this.initializeActiveRecallSessionData();
        this.sessionUpdateSubscribers = [];
    }

    private async initializeActiveRecallSessionData(): Promise<void> {
        try {
            const sessionHistory = await this.historyManager.getSessionHistory();

            if (
                sessionHistory.length > 0 &&
                sessionHistory[sessionHistory.length - 1].isPending
            ) {
                this.currentSession = sessionHistory[sessionHistory.length - 1];
            } else {
                const activeRecallData = await this.store.getActiveRecallDataIfExists();
                this.currentSession = {
                    score: 0,
                    questions: activeRecallData.questions,
                    userAnswers: Array.from(
                        { length: activeRecallData.questions.length },
                        () => []
                    ),
                    lastModifiedDate: new Date().toISOString(),
                    isPending: true,
                };
                await this.historyManager.addSessionToHistory(this.currentSession);
            }

            this.showScreen();
            this.onSessionUpdate();
        } catch (error) {
            console.error("Failed to initialize active recall session data:", error);
            throw error;
        }
    }

    private onAnswerSubmit = (index: number, answer: number[]) => {
        if (!this.currentSession) {
            throw Error(
                "ActiveRecallSessionMangerService.onAnswerSubmit: session not initialized properly"
            );
        }
        this.currentSession.userAnswers[index] = answer;
        this.historyManager.updateSessionInHistory(this.currentSession);
        this.showScreen();
        this.onSessionUpdate();
    };

    private onFinalSubmit = () => {
        if (!this.currentSession) {
            throw Error(
                "ActiveRecallSessionMangerService.onFinalSubmit: session not initialized properly"
            );
        }
        this.currentSession.isPending = false;
        this.historyManager.updateSessionInHistory(this.currentSession);
        this.showScreen();
        this.onSessionUpdate();
    };

    private async onSessionUpdate(): Promise<void> {
        const sessionHistory = await this.historyManager.getSessionHistory();
        
        this.sessionUpdateSubscribers.forEach((subscriber) => {
            subscriber.onSessionUpdate(sessionHistory);
        });
    }

    private showScreen() {
        this.app.getAppViewController().showScreen({
            id: ScreenNames.Practice,
            onAnswerSubmit: this.onAnswerSubmit,
            onFinalSubmit: this.onFinalSubmit,
            ...this.currentSession,
        } as PracticeScreenProps);
    }

    public async getCurrentSession(): Promise<ActiveRecallSession | undefined> {
        await this.isInitialized;
        return this.currentSession;
    }

    public async getSessionHistory(): Promise<ActiveRecallSession[]> {
        await this.isInitialized;
        return await this.historyManager.getSessionHistory();
    }

    public async initializeSession(): Promise<void> {
        await this.isInitialized;
    }

    public addSessionUpdateSubscriber = (subscriber: ISessionUpdateSubscriber) => {
        // Add the subscriber to a list of subscribers
        this.sessionUpdateSubscribers.push(subscriber);
    };
}
