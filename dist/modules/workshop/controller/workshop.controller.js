import { WorkshopService } from '../service/workshop.service.js';
export class WorkshopController {
    service;
    constructor(service = new WorkshopService()) {
        this.service = service;
    }
    getDashboard = async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const summary = await this.service.getDashboardSummary(req.user.id);
            res.json(summary);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=workshop.controller.js.map