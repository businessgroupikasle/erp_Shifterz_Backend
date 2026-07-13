import type { Request, Response, NextFunction } from "express";
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
export declare const requireAuth: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requirePermission: (permission: string) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const tenantScope: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map