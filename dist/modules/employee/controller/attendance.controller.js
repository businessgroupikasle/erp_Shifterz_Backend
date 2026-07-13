import { AttendanceService } from '../service/attendance.service.js';
export class AttendanceController {
    service;
    constructor(service = new AttendanceService()) {
        this.service = service;
    }
    getAllAttendance = async (req, res, next) => {
        try {
            const userRole = req.user?.role || "UNKNOWN";
            const userId = req.user?.id || "";
            const userFranchiseId = req.user?.franchiseId || undefined;
            const list = await this.service.getAllAttendance(userRole, userId, userFranchiseId);
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    checkIn = async (req, res, next) => {
        try {
            const result = await this.service.checkIn(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    checkOut = async (req, res, next) => {
        try {
            const result = await this.service.checkOut(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateAttendance = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateAttendance(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=attendance.controller.js.map