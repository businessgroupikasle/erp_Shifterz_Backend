import { db } from '../../../lib/db.js';

export class WorkshopRepository {
  async getAttendanceByDateAndEmployee(employeeId: string, date: string) {
    return db.attendance.findFirst({
      where: {
        employeeId,
        date,
        isDeleted: false
      }
    });
  }

  async getJobsByTechnician(technicianId: string) {
    return db.job.findMany({
      where: {
        technicianId,
        isDeleted: false
      }
    });
  }
}
