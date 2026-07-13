import { SettingsRepository } from '../repository/settings.repository.js';
export class SettingsService {
    repository;
    constructor(repository = new SettingsRepository()) {
        this.repository = repository;
    }
    async getSettings() {
        let settings = await this.repository.getSettings();
        if (!settings) {
            settings = await this.repository.initDefaultSettings();
        }
        return settings;
    }
    async updateSettings(data) {
        let settings = await this.repository.getSettings();
        if (!settings) {
            await this.repository.initDefaultSettings();
        }
        return this.repository.updateSettings(data);
    }
}
//# sourceMappingURL=settings.service.js.map