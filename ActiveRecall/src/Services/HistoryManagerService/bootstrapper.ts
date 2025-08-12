import { IActiveRecallStoreService } from "../ActiveRecallStoreService";
import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";
import { ServiceContainer } from "../ServiceContainer/ServiceContainer";
import { HistoryManagerService } from "./HistoryManagerService";

export default function main() {
    ServiceContainer.instance.register(
        "IHistoryManagerService",
        (
            store: IActiveRecallStoreService,
            appFacadeService: IAppFacadeService
        ) => {
            return new HistoryManagerService(store, appFacadeService);
        }
    );
}
