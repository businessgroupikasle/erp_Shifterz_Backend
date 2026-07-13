import type { CreateCustomerDTO } from '../validation/customer.validation.js';
export declare class CustomerRepository {
    findAll(tenantFilter: any): Promise<{
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
    }[]>;
    create(id: string, data: CreateCustomerDTO, franchiseId: string | null): Promise<{
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
    }>;
    softDelete(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=customer.repository.d.ts.map