import { Router } from 'express';
import { ReportController } from '../controller/report.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

export const reportRouter = Router();
const controller = new ReportController();

reportRouter.use(authenticate);

reportRouter.get('/', controller.getReports);
