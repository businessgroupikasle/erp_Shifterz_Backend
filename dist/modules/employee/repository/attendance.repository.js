import { db } from '../../../lib/db.js';
export class AttendanceRepository {
    async findAll(tenantFilter) {
        return db.attendance.findMany({
            where: tenantFilter,
            orderBy: { date: "desc" },
            include: {
                franchise: { select: { id: true, name: true, city: true } },
                employee: { select: { id: true, name: true, role: true } }
            }
        });
    }
    async findEmployeeById(id) {
        return db.employee.findUnique({ where: { id } });
    }
    async findExistingCheckIn(employeeId, date) {
        return db.attendance.findFirst({
            where: { employeeId, date, isDeleted: false }
        });
    }
    async findActiveCheckIn(employeeId, date) {
        return db.attendance.findFirst({
            where: { employeeId, date, isDeleted: false, clockOut: null }
        });
    }
    async createCheckIn(employeeId, franchiseId, date, clockIn) {
        return db.attendance.create({
            data: {
                employeeId,
                date,
                status: "Present",
                clockIn,
                franchiseId,
            },
            include: {
                employee: { select: { id: true, name: true, role: true } }
            }
        });
    }
    async updateCheckOut(id, clockOut) {
        return db.attendance.update({
            where: { id },
            data: { clockOut },
            include: {
                employee: { select: { id: true, name: true, role: true } }
            }
        });
    }
    async updateAttendance(id, data) {
        return db.attendance.update({
            where: { id },
            data: {
                status: data.status,
                clockIn: data.clockIn,
                clockOut: data.clockOut,
            },
        });
    }
}
//# sourceMappingURL=attendance.repository.js.map