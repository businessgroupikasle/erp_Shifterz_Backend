import type { UpdateAttendanceDTO } from '../validation/attendance.validation.js';
export declare class AttendanceRepository {
    findAll(tenantFilter: any): Promise<({
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
    findEmployeeById(id: string): Promise<{
        id: string;
        username: string | null;
        name: string;
        phone: string | null;
        email: string | null;
        status: string;
        password: string | null;
        role: string;
        hqControlled: boolean;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
    } | null>;
    findExistingCheckIn(employeeId: string, date: string): Promise<{
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string;
        date: string;
        clockIn: string | null;
        clockOut: string | null;
    } | null>;
    findActiveCheckIn(employeeId: string, date: string): Promise<{
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string;
        date: string;
        clockIn: string | null;
        clockOut: string | null;
    } | null>;
    createCheckIn(employeeId: string, franchiseId: string | null, date: string, clockIn: string): Promise<{
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
    updateCheckOut(id: string, clockOut: string): Promise<{
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
//# sourceMappingURL=attendance.repository.d.ts.map