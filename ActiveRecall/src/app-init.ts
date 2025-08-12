import { App, Plugin } from "obsidian";
import { ServiceContainer } from "./Services/ServiceContainer/ServiceContainer";
import { AppFacadeService } from "./Services/AppFacadeService/AppFacadeService";
import { PluginFacadeService } from "./Services/PluginnFacadeService/PluginFacadeService";
import { IAppController } from "./Controllers/Contracts/IAppController";

export class AppInit {
    private appController: IAppController | undefined;
    constructor(private app: App, private plugin: Plugin) {
        this.appController = undefined;
    }

    public dispose() {
        ServiceContainer.dispose();
    }

    public setAppController(appController: IAppController) {
        this.appController = appController;
        this.initializeFacadeServices();
        this.initializeServices();
    }

    private initializeFacadeServices() {
        ServiceContainer.instance.register("IAppFacadeService", () => {
            if (!this.appController) {
                throw Error("AppInit.initializeFacadeServices: Failed to initialize appController");
            }
            return new AppFacadeService(this.app, this.appController);
        });

        ServiceContainer.instance.register("IPluginFacadeService", () => {
            return new PluginFacadeService(this.plugin);
        });
    }

    private initializeServices() {
        ServiceContainer.instance.get("IActiveRecallSessionManagerService");
    }
}
