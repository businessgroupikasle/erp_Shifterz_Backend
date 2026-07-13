import type { UpdateAttendanceDTO } from '../validation/attendance.validation.js';
export declare class AttendanceRepository {
    findAll(tenantFilter: any): Promise<({
        employee: {
            id: string;
            role: string;
            name: string;
        };
        franchise: {
            id: string;
            name: string;
            city: string;
        } | null;
    } & {
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        date: string;
        employeeId: string;
        clockIn: string | null;
        clockOut: string | null;
    })[]>;
    findEmployeeById(id: string): Promise<{
        id: string;
        role: string;
        name: string;
        phone: string | null;
        status: string;
        email: string | null;
        username: string | null;
        password: string | null;
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
        date: string;
        employeeId: string;
        clockIn: string | null;
        clockOut: string | null;
    } | null>;
    findActiveCheckIn(employeeId: string, date: string): Promise<{
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        date: string;
        employeeId: string;
        clockIn: string | null;
        clockOut: string | null;
    } | null>;
    createCheckIn(employeeId: string, franchiseId: string | null, date: string, clockIn: string): Promise<{
        employee: {
            id: string;
            role: string;
            name: string;
        };
    } & {
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        date: string;
        employeeId: string;
        clockIn: string | null;
        clockOut: string | null;
    }>;
    updateCheckOut(id: string, clockOut: string): Promise<{
        employee: {
            id: string;
            role: string;
            name: string;
        };
    } & {
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        date: string;
        employeeId: string;
        clockIn: string | null;
        clockOut: string | null;
    }>;
    updateAttendance(id: string, data: UpdateAttendanceDTO): Promise<{
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        date: string;
        employeeId: string;
        clockIn: string | null;
        clockOut: string | null;
    }>;
}
//# sourceMappingURL=attendance.repository.d.ts.map