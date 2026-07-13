import { SettingsService } from '../service/settings.service.js';
export class SettingsController {
    service;
    constructor(service = new SettingsService()) {
        this.service = service;
    }
    getSettings = async (req, res, next) => {
        try {
            const settings = await this.service.getSettings();
            res.json(settings);
        }
        catch (error) {
            next(error);
        }
    };
    updateSettings = async (req, res, next) => {
        try {
            const result = await this.service.updateSettings(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=settings.controller.js.map