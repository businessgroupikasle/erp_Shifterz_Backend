import { EmployeeRepository } from '../repository/employee.repository.js';
import type { CreateEmployeeDTO, UpdateEmployeeDTO } from '../validation/employee.validation.js';
export declare class EmployeeService {
    private readonly repository;
    constructor(repository?: EmployeeRepository);
    getAllEmployees(userRole: string, userFranchiseId?: string): Promise<{
        permissions: string[];
        permission: {
            id: string;
            employeeId: string;
            modules: string[];
            createdAt: Date;
            updatedAt: Date;
        } | null;
        franchise: {
            id: string;
            name: string;
            city: string;
        } | null;
        id: string;
        username: string | null;
        name: string;
        phone: string | null;
        email: string | null;
        status: string;
        role: string;
        hqControlled: boolean;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
    }[]>;
    getHqEmployees(): Promise<{
        id: string;
        username: string | null;
        name: string;
        phone: string | null;
        email: string | null;
        status: string;
        role: string;
        hqControlled: boolean;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
    }[]>;
    getTechnicians(): Promise<{
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
    }[]>;
    createEmployee(data: CreateEmployeeDTO, userRole: string, userFranchiseId?: string, isTechnicianRoute?: boolean): Promise<{
        permissions: string[];
        permission: {
            id: string;
            employeeId: string;
            modules: string[];
            createdAt: Date;
            updatedAt: Date;
        } | null;
        id: string;
        username: string | null;
        name: string;
        phone: string | null;
        email: string | null;
        status: string;
        role: string;
        hqControlled: boolean;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
    }>;
    updateEmployee(id: string, data: UpdateEmployeeDTO): Promise<{
        permissions: string[];
        permission: {
            id: string;
            employeeId: string;
            modules: string[];
            createdAt: Date;
            updatedAt: Date;
        } | null;
        id: string;
        username: string | null;
        name: string;
        phone: string | null;
        email: string | null;
        status: string;
        role: string;
        hqControlled: boolean;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
    }>;
    deleteEmployee(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=employee.service.d.ts.map