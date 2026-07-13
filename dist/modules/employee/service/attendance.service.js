import { AttendanceRepository } from '../repository/attendance.repository.js';
import { ApiError } from '../../../shared/errors/ApiError.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
export class AttendanceService {
    repository;
    constructor(repository = new AttendanceRepository()) {
        this.repository = repository;
    }
    async getAllAttendance(userRole, userId, userFranchiseId) {
        let tenantFilter = { isDeleted: false };
        if (userRole === "SUPER_ADMIN" || userRole === "HQ_USER") {
            // HQ sees all
        }
        else if (userRole === "FRANCHISE_ADMIN" || userRole === "BRANCH_MANAGER") {
            // Franchise Admin sees their franchise
            tenantFilter.franchiseId = userFranchiseId;
        }
        else {
            // Normal employees see only their own attendance
            tenantFilter.employeeId = userId;
        }
        return this.repository.findAll(tenantFilter);
    }
    async checkIn(data) {
        const emp = await this.repository.findEmployeeById(data.employeeId);
        if (!emp) {
            throw new NotFoundError("Employee not found");
        }
        const date = new Date().toISOString().slice(0, 10);
        const clockIn = new Date().toISOString();
        const existing = await this.repository.findExistingCheckIn(data.employeeId, date);
        if (existing) {
            throw new ApiError(400, "Already checked in for today");
        }
        return this.repository.createCheckIn(data.employeeId, emp.franchiseId, date, clockIn);
    }
    async checkOut(data) {
        const date = new Date().toISOString().slice(0, 10);
        const clockOut = new Date().toISOString();
        const existing = await this.repository.findActiveCheckIn(data.employeeId, date);
        if (!existing) {
            throw new ApiError(400, "No active check-in found for today");
        }
        return this.repository.updateCheckOut(existing.id, clockOut);
    }
    async updateAttendance(id, data) {
        return this.repository.updateAttendance(id, data);
    }
}
//# sourceMappingURL=attendance.service.js.map