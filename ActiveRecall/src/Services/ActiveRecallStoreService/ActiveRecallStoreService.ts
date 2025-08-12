import { TFile, TFolder } from "obsidian";
import {
    ACTIVE_RECALL_FOLDER_NAME,
    ACTIVE_RECALL_QUESTION_FILE_NAME,
    ActiveRecallData,
    ActiveRecallQuestion,
    ActiveRecallSession,
} from "./Contracts/ActiveRecallStoreContracts";
import { type IPluginFacadeService } from "../PluginnFacadeService/Contracts/IPluginFacadeService";
import { type IFileManagerService } from "../FileManagerService/Contracts/IFileMangerService";
import { IActiveRecallStoreService } from "./Contracts/IActiveRecallStoreService";

export class ActiveRecallStoreService implements IActiveRecallStoreService {
    private cachedFolderKey: string | undefined;

    constructor(
        private fileManagerService: IFileManagerService,
        private plugin: IPluginFacadeService
    ) {}

    public async getActiveRecallDataIfExists(): Promise<ActiveRecallData> {
        const activeRecallFolder = this.linearSearchForActiveRecallStoreFolder();
        const questionsFile = activeRecallFolder?.children.find((file) => {
            return file instanceof TFile && file.name === ACTIVE_RECALL_QUESTION_FILE_NAME;
        });
        if (!questionsFile || !(questionsFile instanceof TFile)) {
            throw Error(
                "ActiveRecallStoreManager.getActiveRecallDataIfExists: active recall data is not present in the active file hierarchy"
            );
        }

        const questionJsonString = await this.fileManagerService.readFileData(questionsFile);

        return {
            questions: JSON.parse(questionJsonString) as ActiveRecallQuestion[],
        };
    }

    public async validateAndGetActiveRecallSessionData(
        folderKey: string
    ): Promise<ActiveRecallSession[]> {
        const data = await this.plugin.loadPluginPersistenceData(folderKey);
        if (!this.validateDiskData(data)) {
            throw new Error(
                "ActiveRecallStoreManager.validateAndGetActiveRecallSessionData: Invalid data format"
            );
        }

        if (data === null) {
            return [];
        }

        data as ActiveRecallSession[];

        return data;
    }

    public async validateAndSaveActiveRecallSessionData(
        folderKey: string,
        sessionHistory: ActiveRecallSession[]
    ) {
        if (!this.validateDiskData(sessionHistory)) {
            throw new Error(
                "ActiveRecallStoreManager.validateAndSaveActiveRecallSessionData: Invalid data format"
            );
        }

        return this.plugin.savePluginPersistenceData(folderKey, sessionHistory);
    }

    public getFolderKey(): string {
        if(!this.cachedFolderKey) {
            const activeRecallFolder = this.linearSearchForActiveRecallStoreFolder();
            if (!activeRecallFolder) {
                throw new Error("ActiveRecallStoreService.getFolderKey: Active recall folder not found");
            }
            this.cachedFolderKey = activeRecallFolder.path;
        }
        return this.cachedFolderKey;
    }

    /**
     * gets the active recall folder in the active files hierarchy if exists
     * @returns `activeRecallFolder` if exists, else returns `null`
     */
    private linearSearchForActiveRecallStoreFolder(): TFolder | null {
        const hierarchy = this.fileManagerService.getActiveFileParentsHierarchy();

        if (!hierarchy) {
            return null;
        }

        for (const folder of hierarchy) {
            const activeRecallFolder = this.fileManagerService.findDirInFolder(
                ACTIVE_RECALL_FOLDER_NAME,
                folder,
                false /* recursive */
            );

            if (activeRecallFolder) {
                return activeRecallFolder;
            }
        }
        return null;
    }

    private validateDiskData(data: unknown): data is ActiveRecallSession[] {
        if (data == null) {
            return true;
        }

        if (!Array.isArray(data)) {
            return false;
        }
        for (const item of data) {
            if (
                typeof item !== "object" ||
                item === null ||
                !("questions" in item) ||
                !Array.isArray(item.questions)
            ) {
                return false;
            }
        }
        return true;
    }
}
