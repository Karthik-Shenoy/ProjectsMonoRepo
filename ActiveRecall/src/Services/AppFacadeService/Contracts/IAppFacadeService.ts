import { App } from "obsidian";
import { IAppController } from "src/Controllers/Contracts/IAppController";

export interface IAppFacadeService {
    getApp(): App;
    getAppViewController(): IAppController;
}
