import type { Request } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
        permissions: string[];
        franchiseId?: string | null;
    };
}
export declare function resolveUserPermissions(userId: string, role: string): Promise<string[]>;
//# sourceMappingURL=auth.d.ts.map