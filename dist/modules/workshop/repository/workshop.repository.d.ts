export declare class WorkshopRepository {
    getAttendanceByDateAndEmployee(employeeId: string, date: string): Promise<{
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
    getJobsByTechnician(technicianId: string): Promise<{
        id: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        customer: string;
        vehicle: string;
        notes: string;
        technician: string;
        priority: string;
        startDate: string;
        estCompletion: string;
        actualCompletion: string | null;
        photos: string[];
        technicianId: string | null;
        createdAt: Date;
    }[]>;
}
//# sourceMappingURL=workshop.repository.d.ts.map