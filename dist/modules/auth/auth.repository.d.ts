export declare class AuthRepository {
    findEmployeeByUsername(username: string): Promise<({
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
    }) | null>;
    findEmployeeById(id: string): Promise<({
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
    }) | null>;
    updateEmployee(id: string, data: any): Promise<{
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
    findAllRolePermissions(): Promise<{
        role: string;
        permissions: string[];
    }[]>;
    upsertRolePermission(role: string, permissions: string[]): Promise<{
        role: string;
        permissions: string[];
    }>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map