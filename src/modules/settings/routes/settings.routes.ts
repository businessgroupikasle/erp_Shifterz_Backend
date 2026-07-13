import { Router } from 'express';
import { SettingsController } from '../controller/settings.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { updateSettingSchema } from '../validation/settings.validation.js';

export const settingsRouter = Router();
const controller = new SettingsController();

settingsRouter.use(authenticate);

settingsRouter.get('/', controller.getSettings);
settingsRouter.put('/', validate(updateSettingSchema), controller.updateSettings);
