import { db } from '../../../lib/db.js';
export class WorkshopRepository {
    async getAttendanceByDateAndEmployee(employeeId, date) {
        return db.attendance.findFirst({
            where: {
                employeeId,
                date,
                isDeleted: false
            }
        });
    }
    async getJobsByTechnician(technicianId) {
        return db.job.findMany({
            where: {
                technicianId,
                isDeleted: false
            }
        });
    }
}
//# sourceMappingURL=workshop.repository.js.map