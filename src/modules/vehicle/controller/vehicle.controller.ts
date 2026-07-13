import type { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../service/vehicle.service.js';

export class VehicleController {
  constructor(private readonly service: VehicleService = new VehicleService()) {}

  lookupVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleNo = String(req.params.vehicleNo || "").toUpperCase();
      const result = await this.service.lookupVehicle(vehicleNo);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Vehicle not found in any records") {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };
}
