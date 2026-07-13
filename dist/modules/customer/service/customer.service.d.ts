import { CustomerRepository } from '../repository/customer.repository.js';
import type { CreateCustomerDTO } from '../validation/customer.validation.js';
export declare class CustomerService {
    private readonly repository;
    constructor(repository?: CustomerRepository);
    getCustomers(tenantFilter: any): Promise<{
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
    createCustomer(data: CreateCustomerDTO, franchiseId: string | null): Promise<{
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
    deleteCustomer(id: string): Promise<{
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
//# sourceMappingURL=customer.service.d.ts.map