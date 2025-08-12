import { App } from "obsidian";
import { IAppFacadeService } from "./Contracts/IAppFacadeService";
import { ServiceContainer } from "../ServiceContainer/ServiceContainer";
import { IAppController } from "src/Controllers/Contracts/IAppController";

export class AppFacadeService implements IAppFacadeService {
    constructor(private app: App, private appViewController: IAppController) {}

    public getApp(): App {
        return this.app;
    }

    public getAppViewController(): IAppController {
        return this.appViewController;
    }
}
