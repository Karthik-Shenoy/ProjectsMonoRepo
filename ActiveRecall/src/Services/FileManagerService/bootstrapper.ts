import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";
import { ServiceContainer } from "../ServiceContainer/ServiceContainer";
import { FileManagerService } from "./FileManagerService";

export default function main() {
    ServiceContainer.instance.register("IFileManagerService", (appFacade: IAppFacadeService) => {
        return new FileManagerService(appFacade);
    });
}
