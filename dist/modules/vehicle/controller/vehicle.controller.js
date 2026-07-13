import { VehicleService } from '../service/vehicle.service.js';
export class VehicleController {
    service;
    constructor(service = new VehicleService()) {
        this.service = service;
    }
    lookupVehicle = async (req, res, next) => {
        try {
            const vehicleNo = String(req.params.vehicleNo || "").toUpperCase();
            const result = await this.service.lookupVehicle(vehicleNo);
            res.json(result);
        }
        catch (error) {
            if (error.message === "Vehicle not found in any records") {
                res.status(404).json({ error: error.message });
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=vehicle.controller.js.map