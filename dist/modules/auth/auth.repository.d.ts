export declare class AuthRepository {
    findEmployeeByUsername(username: string): Promise<({
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
    }) | null>;
    findEmployeeById(id: string): Promise<({
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
    }) | null>;
    updateEmployee(id: string, data: any): Promise<{
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