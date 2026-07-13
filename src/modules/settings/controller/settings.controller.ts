import type { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../service/settings.service.js';

export class SettingsController {
  constructor(private readonly service: SettingsService = new SettingsService()) {}

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.service.getSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.updateSettings(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
