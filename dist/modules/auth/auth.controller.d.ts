import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
export declare class AuthController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map