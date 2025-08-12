import { IFileManagerService } from "../FileManagerService/Contracts/IFileMangerService";
import { IPluginFacadeService } from "../PluginnFacadeService/Contracts/IPluginFacadeService";
import { ServiceContainer } from "../ServiceContainer/ServiceContainer";
import { ActiveRecallStoreService } from "./ActiveRecallStoreService";

export default function main() {
    ServiceContainer.instance.register(
        "IActiveRecallStoreService",
        (fileManagerService: IFileManagerService, pluginFacadeService: IPluginFacadeService) => {
            return new ActiveRecallStoreService(fileManagerService, pluginFacadeService);
        }
    );
}
