import { Router } from 'express';
import { VehicleController } from '../controller/vehicle.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

export const vehicleRouter = Router();
const controller = new VehicleController();

vehicleRouter.use(authenticate);

vehicleRouter.get('/:vehicleNo', controller.lookupVehicle);
