import { VehicleCheckinService } from '../service/vehicle-checkin.service.js';
export class VehicleCheckinController {
    service;
    constructor(service = new VehicleCheckinService()) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const list = await this.service.getAllCheckins();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const franchiseId = req.user?.franchiseId || null;
            const result = await this.service.createCheckin(req.body, franchiseId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const updated = await this.service.updateCheckin(id, req.body);
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    };
    checkout = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.checkout(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteCheckin(id);
            res.json({ success: true, message: "Car entry deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=vehicle-checkin.controller.js.map