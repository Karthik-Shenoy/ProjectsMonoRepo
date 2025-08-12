import { App, TFile, TFolder } from "obsidian";
import { IFileManagerService } from "./Contracts/IFileMangerService";
import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";

export class FileManagerService implements IFileManagerService {
    private app: App;

    constructor(appFacadeService: IAppFacadeService) {
        this.app = appFacadeService.getApp();
    }

    public getActiveFile(): TFile | null | undefined {
        const file = this.app.workspace.activeEditor?.file;
        console.log(file);
        return file;
    }

    public getActiveFileParentsHierarchy(): TFolder[] | undefined {
        const activeFile = this.getActiveFile();

        if (!activeFile) {
            return undefined;
        }

        let currParent: TFolder | null | undefined = activeFile.parent;
        const parentHierarchy: TFolder[] = [];
        do {
            if (currParent) {
                parentHierarchy.push(currParent);
            }
            currParent = currParent?.parent;
        } while (currParent);

        return parentHierarchy;
    }

    public findDirInFolder(
        dirName: string,
        folderToBeSearched: TFolder,
        recursive: boolean = false
    ): TFolder | undefined {
        if (recursive) {
            return this.findDirInFolderRecursiveInternal();
        }

        const children = folderToBeSearched.children;
        for (const child of children) {
            if (!(child instanceof TFolder)) {
                continue;
            }
            if (child.name == dirName) {
                return child;
            }
        }
    }

    public readFileData(file: TFile): Promise<string> {
        return this.app.vault.read(file);
    }

    private findDirInFolderRecursiveInternal() {
        return undefined;
    }
}

