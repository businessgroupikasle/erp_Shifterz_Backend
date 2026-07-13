import { ServiceService } from '../service/service.service.js';
export class ServiceController {
    service;
    constructor(service = new ServiceService()) {
        this.service = service;
    }
    getAllServices = async (req, res, next) => {
        try {
            const list = await this.service.getAllServices();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createService = async (req, res, next) => {
        try {
            const result = await this.service.createService(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateService = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateService(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteService = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteService(id);
            res.json({ success: true, message: "Service deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=service.controller.js.map