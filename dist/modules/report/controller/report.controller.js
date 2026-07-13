import { ReportService } from '../service/report.service.js';
export class ReportController {
    service;
    constructor(service = new ReportService()) {
        this.service = service;
    }
    getReports = async (req, res, next) => {
        try {
            const data = await this.service.getReports();
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=report.controller.js.map