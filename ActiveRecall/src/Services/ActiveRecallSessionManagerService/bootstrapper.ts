import { IActiveRecallStoreService } from "../ActiveRecallStoreService";
import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";
import { IPluginFacadeService } from "../PluginnFacadeService/Contracts/IPluginFacadeService";
import { ServiceContainer } from "../ServiceContainer/ServiceContainer";
import { ActiveRecallSessionManagerService } from "./ActiveRecallSessionManagerService";
import { IHistoryManagerService } from "../HistoryManagerService/Contracts/IHistoryManagerService";

export default function main() {
    ServiceContainer.instance.register(
        "IActiveRecallSessionManagerService",
        (
            store: IActiveRecallStoreService,
            pluginFacade: IPluginFacadeService,
            appFacadeService: IAppFacadeService,
            historyManager: IHistoryManagerService
        ) => {
            return new ActiveRecallSessionManagerService(store, pluginFacade, appFacadeService, historyManager);
        }
    );
}
