import { IActiveRecallStoreService } from "../ActiveRecallStoreService";
import { IFileManagerService } from "../FileManagerService/Contracts/IFileMangerService";
import { IPluginFacadeService } from "../PluginnFacadeService/Contracts/IPluginFacadeService";
import { IAppFacadeService } from "../AppFacadeService/Contracts/IAppFacadeService";
import { IActiveRecallSessionManagerService } from "../ActiveRecallSessionManagerService/Contracts/IActiveRecallSessionManagerService";
import { IHistoryManagerService } from "../HistoryManagerService/Contracts/IHistoryManagerService";

export type ServiceData<T extends keyof ServiceDependencyMap> = {
    instance: ServiceDependencyMap[T]["type"] | null;
    dependencyKeys: readonly (keyof ServiceDependencyMap)[];
    serviceFactory: ServiceFactory<T>;
    serviceName: T;
};

// Service dependency mapping - This is where you define what each service depends on
export interface ServiceDependencyMap {
    IActiveRecallStoreService: {
        dependencies: [IFileManagerService, IPluginFacadeService];
        type: IActiveRecallStoreService;
    };
    IFileManagerService: {
        dependencies: [IAppFacadeService];
        type: IFileManagerService;
    };
    IPluginFacadeService: {
        dependencies: [];
        type: IPluginFacadeService;
    };
    IAppFacadeService: {
        dependencies: [];
        type: IAppFacadeService;
    };
    IActiveRecallSessionManagerService: {
        dependencies: [IActiveRecallStoreService, IPluginFacadeService, IAppFacadeService, IHistoryManagerService];
        type: IActiveRecallSessionManagerService;
    };
    IHistoryManagerService: {
        dependencies: [IActiveRecallStoreService, IAppFacadeService];
        type: IHistoryManagerService;
    };
}

export const dependencyLookupMap: Record<
    keyof ServiceDependencyMap,
    readonly (keyof ServiceDependencyMap)[]
> = {
    IActiveRecallStoreService: ["IFileManagerService", "IPluginFacadeService"] as const,
    IFileManagerService: ["IAppFacadeService"] as const,
    IPluginFacadeService: [] as const,
    IAppFacadeService: [] as const,
    IActiveRecallSessionManagerService: [
        "IActiveRecallStoreService",
        "IPluginFacadeService",
        "IAppFacadeService",
        "IHistoryManagerService"
    ] as const,
    IHistoryManagerService: [
        "IActiveRecallStoreService",
        "IAppFacadeService"
    ] as const,
};

export type ServiceFactory<T extends keyof ServiceDependencyMap> = (
    ...dependencies: ServiceDependencyMap[T]["dependencies"]
) => ServiceDependencyMap[T]["type"];

// Type utility to get dependencies by service type
export type GetServiceDependencies<T extends keyof ServiceDependencyMap> = ServiceDependencyMap[T];
