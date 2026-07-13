import { JobCardService } from '../service/job-card.service.js';
import { logger } from '../../../shared/logger/logger.js';
export class JobCardController {
    service;
    constructor(service = new JobCardService()) {
        this.service = service;
    }
    getJobs = async (req, res, next) => {
        try {
            let filter = {};
            if (req.user) {
                if (req.user.role?.toUpperCase() === "TECHNICIAN" && req.user.id) {
                    // Changed to user.id because token uses id for employeeId, not technicianId natively in all cases
                    filter = { technicianId: req.user.id };
                }
            }
            const list = await this.service.getJobs(filter);
            logger.info(`[Jobs API] User Role: ${req.user?.role}, Filter: ${JSON.stringify(filter)}, Results: ${list.length}`);
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createJob = async (req, res, next) => {
        try {
            const result = await this.service.createJob(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateJob = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateJob(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteJob = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteJob(id);
            res.json({ success: true, message: "Job deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=job-card.controller.js.map