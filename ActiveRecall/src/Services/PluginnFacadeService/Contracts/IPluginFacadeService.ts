export interface IPluginFacadeService {
    loadPluginPersistenceData(key: string): Promise<unknown>;
    savePluginPersistenceData(key: string, data: unknown): Promise<void>;
}
