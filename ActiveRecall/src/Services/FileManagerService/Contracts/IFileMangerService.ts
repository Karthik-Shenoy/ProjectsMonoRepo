import type { TFile, TFolder } from "obsidian";

export interface IFileManagerService {
    getActiveFileParentsHierarchy: () => TFolder[] | undefined;
    findDirInFolder(
        dirName: string,
        folderToBeSearched: TFolder,
        recursive: boolean
    ): TFolder | undefined;
    readFileData(file: TFile): Promise<string>;
}
