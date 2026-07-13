import { authService } from "./auth.service.js";
export class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);
            res.json(result);
        }
        catch (error) {
            if (error.message === "Invalid username or password") {
                res.status(401).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
    async getMe(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const user = await authService.getMe(req.user.id);
            res.json({ user });
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async updateProfile(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const updatedUser = await authService.updateProfile(req.user.id, req.body);
            res.json(updatedUser);
        }
        catch (error) {
            if (error.message === "Current password incorrect" || error.message === "User not found") {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
    async getRolePermissions(req, res, next) {
        try {
            const permissions = await authService.getRolePermissions();
            res.json(permissions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateRolePermissions(req, res, next) {
        try {
            const role = String(req.params.role);
            const { permissions } = req.body;
            const updated = await authService.updateRolePermissions(role, permissions);
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map