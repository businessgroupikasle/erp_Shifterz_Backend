import { SettingsRepository } from '../repository/settings.repository.js';
import type { UpdateSettingDTO } from '../validation/settings.validation.js';

export class SettingsService {
  constructor(private readonly repository: SettingsRepository = new SettingsRepository()) {}

  async getSettings() {
    let settings = await this.repository.getSettings();
    if (!settings) {
      settings = await this.repository.initDefaultSettings();
    }
    return settings;
  }

  async updateSettings(data: UpdateSettingDTO) {
    let settings = await this.repository.getSettings();
    if (!settings) {
      await this.repository.initDefaultSettings();
    }
    return this.repository.updateSettings(data);
  }
}
