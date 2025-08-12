import { ScreenNames } from "src/ViewControllerInterop/SharedTypes";
import { ActiveRecallSession } from "../ActiveRecallStoreService/Contracts/ActiveRecallStoreContracts";
import { IActiveRecallStoreService } from "../ActiveRecallStoreService";
import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";
import { IHistoryManagerService } from "./Contracts/IHistoryManagerService";
import { HistoryScreenProps } from "src/View/Screens/HistoryScreen/HistoryScreen.props";

export class HistoryManagerService implements IHistoryManagerService {
    private sessionHistory: ActiveRecallSession[] | undefined;
    private isInitialized: Promise<void>;

    private currentActiveRecallFolderKey: string;

    constructor(
        private store: IActiveRecallStoreService,
        private app: IAppFacadeService
    ) {
        this.isInitialized = this.initializeHistoryData();
        this.currentActiveRecallFolderKey = this.store.getFolderKey();
            
    }

    private async initializeHistoryData(): Promise<void> {
        try {
            if (this.sessionHistory !== undefined) {
                return;
            }

            const data = await this.store.validateAndGetActiveRecallSessionData(this.currentActiveRecallFolderKey);
            this.sessionHistory = data;
            this.updateHistoryView();

        } catch (error) {
            console.error("Failed to initialize history data:", error);
            this.sessionHistory = [];
        }
    }

    public async getSessionHistory(): Promise<ActiveRecallSession[]> {
        await this.isInitialized;
        return this.sessionHistory || [];
    }

    public async showHistoryScreen(): Promise<void> {
        await this.isInitialized;
        await this.displayHistoryScreen();
    }

    public async populateHistoryScreenProps(): Promise<void> {
        await this.isInitialized;
        await this.updateHistoryView();
    }

    /**
     * Displays the history screen for the first time
     */
    private async displayHistoryScreen(): Promise<void> {
        // Refresh data from store first
        await this.refreshHistoryData();
        
        const completedSessions = (this.sessionHistory || []).filter(session => !session.isPending);
        
        this.app.getAppViewController().showScreen({
            id: ScreenNames.History,
            sessions: completedSessions,
            onSessionSelect: this.onSessionSelect,
            onDeleteSession: this.onDeleteSession,
            onExportHistory: this.onExportHistory
        } as HistoryScreenProps);
    }

    /**
     * Updates the history view with current session data
     * This method should be called after any store interaction
     */
    private async updateHistoryView(): Promise<void> {
        // Refresh data from store first
        await this.refreshHistoryData();
        
        const completedSessions = (this.sessionHistory || []).filter(session => !session.isPending);
        
        // Use updateProps instead of showScreen for updates
        this.app.getAppViewController().updateProps({
            id: ScreenNames.History,
            sessions: completedSessions,
            onSessionSelect: this.onSessionSelect,
            onDeleteSession: this.onDeleteSession,
            onExportHistory: this.onExportHistory
        } as HistoryScreenProps);
    }

    /**
     * Refreshes history data from the store
     */
    private async refreshHistoryData(): Promise<void> {
        try {
            const data = await this.store.validateAndGetActiveRecallSessionData(this.currentActiveRecallFolderKey);
            this.sessionHistory = data;
        } catch (error) {
            console.error("Failed to refresh history data:", error);
            this.sessionHistory = [];
        }
    }

    public async addSessionToHistory(session: ActiveRecallSession): Promise<void> {
        await this.isInitialized;
        
        if (!this.sessionHistory) {
            this.sessionHistory = [];
        }
        
        this.sessionHistory.push(session);
        await this.store.validateAndSaveActiveRecallSessionData(this.currentActiveRecallFolderKey, this.sessionHistory);

        // Update history view after store interaction
        await this.updateHistoryView();
    }

    public async updateSessionInHistory(updatedSession: ActiveRecallSession): Promise<void> {
        await this.isInitialized;
        
        if (!this.sessionHistory) {
            return;
        }

        const index = this.sessionHistory.findIndex(session => 
            session.lastModifiedDate === updatedSession.lastModifiedDate
        );
        
        if (index !== -1) {
            this.sessionHistory[index] = updatedSession;
            await this.store.validateAndSaveActiveRecallSessionData(this.currentActiveRecallFolderKey, this.sessionHistory);
            
            // Update history view after store interaction
            await this.updateHistoryView();
        }
    }

    private onSessionSelect = (session: ActiveRecallSession) => {
        // Handle session selection - could show detailed view
        console.log("Session selected:", session);
    };

    private onDeleteSession = async (session: ActiveRecallSession) => {
        await this.isInitialized;
        
        if (!this.sessionHistory) {
            return;
        }

        this.sessionHistory = this.sessionHistory.filter(s => 
            s.lastModifiedDate !== session.lastModifiedDate
        );

        await this.store.validateAndSaveActiveRecallSessionData(this.currentActiveRecallFolderKey, this.sessionHistory);

        // Update history view after store interaction
        await this.updateHistoryView();
    };

    private onExportHistory = async () => {
        await this.isInitialized;
        
        const history = this.sessionHistory || [];
        const exportData = JSON.stringify(history, null, 2);
        
        // Could implement actual export functionality here
        console.log("Exporting history:", exportData);
    };
}
