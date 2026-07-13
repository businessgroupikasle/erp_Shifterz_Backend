import { OutpassRepository } from '../repository/outpass.repository.js';
import type { CreateOutpassDTO, UpdateOutpassDTO } from '../validation/outpass.validation.js';
export declare class OutpassService {
    private readonly repository;
    constructor(repository?: OutpassRepository);
    getAllOutpasses(): Promise<{
        id: string;
        phone: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        customer: string;
        vehicle: string;
        model: string;
        securityName: string;
        outTime: string;
        technicianName: string;
        remarks: string;
        issued: boolean;
        carInId: string;
    }[]>;
    createOutpass(data: CreateOutpassDTO): Promise<{
        id: string;
        phone: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        customer: string;
        vehicle: string;
        model: string;
        securityName: string;
        outTime: string;
        technicianName: string;
        remarks: string;
        issued: boolean;
        carInId: string;
    }>;
    updateOutpass(id: string, data: UpdateOutpassDTO): Promise<{
        id: string;
        phone: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        customer: string;
        vehicle: string;
        model: string;
        securityName: string;
        outTime: string;
        technicianName: string;
        remarks: string;
        issued: boolean;
        carInId: string;
    }>;
}
//# sourceMappingURL=outpass.service.d.ts.map