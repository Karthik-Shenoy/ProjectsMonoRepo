import { ActiveRecallSessionManagerServiceBootStrapper } from "./ActiveRecallSessionManagerService";
import { ActiveRecallStoreServiceBootStrapper } from "./ActiveRecallStoreService";
import { FileManagerServiceBootStrapper } from "./FileManagerService";
import { HistoryManagerServiceBootStrapper } from "./HistoryManagerService";

export default function bootstrapServices() {
    // Register services in dependency order (dependencies first)
    FileManagerServiceBootStrapper.default(); // Depends on: AppFacadeService
    ActiveRecallStoreServiceBootStrapper.default(); // Depends on: FileManagerService, PluginFacadeService
    HistoryManagerServiceBootStrapper.default(); // Depends on: ActiveRecallStoreService, AppFacadeService
    ActiveRecallSessionManagerServiceBootStrapper.default(); // Depends on: ActiveRecallStoreService, PluginFacadeService, AppFacadeService, HistoryManagerService
}
