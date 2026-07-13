import { AttendanceRepository } from '../repository/attendance.repository.js';
import type { CheckInDTO, CheckOutDTO, UpdateAttendanceDTO } from '../validation/attendance.validation.js';
export declare class AttendanceService {
    private readonly repository;
    constructor(repository?: AttendanceRepository);
    getAllAttendance(userRole: string, userId: string, userFranchiseId?: string): Promise<({
        franchise: {
            id: string;
            name: string;
            city: string;
        } | null;
        employee: {
            id: string;
            name: string;
            role: string;
        };
    } & {
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string;
        date: string;
        clockIn: string | null;
        clockOut: string | null;
    })[]>;
    checkIn(data: CheckInDTO): Promise<{
        employee: {
            id: string;
            name: string;
            role: string;
        };
    } & {
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string;
        date: string;
        clockIn: string | null;
        clockOut: string | null;
    }>;
    checkOut(data: CheckOutDTO): Promise<{
        employee: {
            id: string;
            name: string;
            role: string;
        };
    } & {
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string;
        date: string;
        clockIn: string | null;
        clockOut: string | null;
    }>;
    updateAttendance(id: string, data: UpdateAttendanceDTO): Promise<{
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string;
        date: string;
        clockIn: string | null;
        clockOut: string | null;
    }>;
}
//# sourceMappingURL=attendance.service.d.ts.map