import { db } from '../../../lib/db.js';
import type { UpdateAttendanceDTO } from '../validation/attendance.validation.js';

export class AttendanceRepository {
  async findAll(tenantFilter: any) {
    return db.attendance.findMany({
      where: tenantFilter,
      orderBy: { date: "desc" },
      include: {
        franchise: { select: { id: true, name: true, city: true } },
        employee: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async findEmployeeById(id: string) {
    return db.employee.findUnique({ where: { id } });
  }

  async findExistingCheckIn(employeeId: string, date: string) {
    return db.attendance.findFirst({
      where: { employeeId, date, isDeleted: false }
    });
  }

  async findActiveCheckIn(employeeId: string, date: string) {
    return db.attendance.findFirst({
      where: { employeeId, date, isDeleted: false, clockOut: null }
    });
  }

  async createCheckIn(employeeId: string, franchiseId: string | null, date: string, clockIn: string) {
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

  async updateCheckOut(id: string, clockOut: string) {
    return db.attendance.update({
      where: { id },
      data: { clockOut },
      include: {
        employee: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async updateAttendance(id: string, data: UpdateAttendanceDTO) {
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
