import { Plugin } from "obsidian";
import { IPluginFacadeService } from "./Contracts/IPluginFacadeService";
import { PluginData } from "./Contracts/PluginTypes";

export class PluginFacadeService implements IPluginFacadeService {
    private pluginData: PluginData | undefined;
    constructor(private plugin: Plugin) {}

    public loadPluginPersistenceData(key: string): Promise<unknown> {
        if (this.pluginData) {
            return Promise.resolve(this.pluginData[key] || null);
        }
        return this.plugin.loadData().then((data: PluginData) => {
            this.pluginData = data;
            
            return this.pluginData[key] || null;
        });
    }

    public savePluginPersistenceData(key: string, data: unknown): Promise<void> {
        if (!this.pluginData) {
            throw new Error(
                "PluginFacadeService.savePluginPersistenceData: Plugin data not loaded. Call loadPluginPersistenceData() first."
            );
        }

        this.pluginData[key] = data;

        return this.plugin.saveData(this.pluginData);
    }
}
