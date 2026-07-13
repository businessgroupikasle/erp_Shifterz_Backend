export declare class VehicleRepository {
    findCustomerByVehicle(vehicleNo: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        vehicle: string;
        model: string;
        visits: number;
        totalSpend: number;
        lastVisit: string;
    } | null>;
    findCarInByVehicle(vehicleNo: string): Promise<{
        id: string;
        phone: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        customer: string;
        vehicle: string;
        notes: string;
        model: string;
        technicianIn: string;
        inTime: string;
        odometer: string;
        outTime: string | null;
        jobCardId: string;
    } | null>;
    findLeadByVehicle(vehicleNo: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        vehicle: string;
        date: string;
        notes: string;
        source: string;
        assignedTo: string;
        budget: string;
    } | null>;
}
//# sourceMappingURL=vehicle.repository.d.ts.map