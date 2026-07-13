export declare class EmployeeRepository {
    findAllEmployees(tenantFilter: any): Promise<({
        permission: {
            id: string;
            createdAt: Date;
            employeeId: string;
            modules: string[];
            updatedAt: Date;
        } | null;
        franchise: {
            id: string;
            name: string;
            city: string;
        } | null;
    } & {
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
    })[]>;
    findHqEmployees(): Promise<{
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
    }[]>;
    findTechnicians(): Promise<{
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
    }[]>;
    countFranchiseUsers(franchiseId: string): Promise<number>;
    create(id: string, data: any, hashedPassword: string | null, normalizedUsername: string | null): Promise<{
        permission: {
            id: string;
            createdAt: Date;
            employeeId: string;
            modules: string[];
            updatedAt: Date;
        } | null;
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
        permission: {
            id: string;
            createdAt: Date;
            employeeId: string;
            modules: string[];
            updatedAt: Date;
        } | null;
    } & {
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
    }>;
    updatePermissions(employeeId: string, modules: string[]): Promise<{
        id: string;
        createdAt: Date;
        employeeId: string;
        modules: string[];
        updatedAt: Date;
    }>;
    softDelete(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=employee.repository.d.ts.map