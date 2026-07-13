import { FranchiseService } from '../service/franchise.service.js';
export class FranchiseController {
    service;
    constructor(service = new FranchiseService()) {
        this.service = service;
    }
    getAllFranchises = async (req, res, next) => {
        try {
            const list = await this.service.getAllFranchises();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createFranchise = async (req, res, next) => {
        try {
            const result = await this.service.createFranchise(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateFranchise = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateFranchise(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteFranchise = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteFranchise(id);
            res.json({ success: true, message: "Franchise deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=franchise.controller.js.map