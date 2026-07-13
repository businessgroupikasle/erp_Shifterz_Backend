export declare class EmployeeRepository {
    findAllEmployees(tenantFilter: any): Promise<({
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
    } & {
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
    })[]>;
    findHqEmployees(): Promise<{
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
    findTechnicians(): Promise<{
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
    countFranchiseUsers(franchiseId: string): Promise<number>;
    create(id: string, data: any, hashedPassword: string | null, normalizedUsername: string | null): Promise<{
        permission: {
            id: string;
            employeeId: string;
            modules: string[];
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    update(id: string, data: any): Promise<{
        permission: {
            id: string;
            employeeId: string;
            modules: string[];
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    updatePermissions(employeeId: string, modules: string[]): Promise<{
        id: string;
        employeeId: string;
        modules: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    softDelete(id: string): Promise<{
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
//# sourceMappingURL=employee.repository.d.ts.map