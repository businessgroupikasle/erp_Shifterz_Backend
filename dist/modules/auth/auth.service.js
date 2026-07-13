import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";
import { resolveUserPermissions } from "../../lib/auth.js";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error("JWT_SECRET is not defined");
export class AuthService {
    async login(username, password) {
        const normalizedUsername = username.trim().toLowerCase();
        const user = await authRepository.findEmployeeByUsername(normalizedUsername);
        if (!user || !user.password) {
            throw new Error("Invalid username or password");
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Invalid username or password");
        }
        const baseRole = user.role.split("|")[0];
        const resolvedPermissions = await resolveUserPermissions(user.id, user.role);
        const tokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role,
            permissions: resolvedPermissions,
            franchiseId: user.franchiseId,
            ...(baseRole === "TECHNICIAN" || baseRole === "QUALITY_INSPECTOR" ? { technicianId: user.id } : {})
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });
        return { token, user: tokenPayload };
    }
    async getMe(userId) {
        const user = await authRepository.findEmployeeById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const baseRole = user.role.split("|")[0];
        const resolvedPermissions = await resolveUserPermissions(user.id, user.role);
        return {
            id: user.id,
            username: user.username,
            role: user.role,
            permissions: resolvedPermissions,
            franchiseId: user.franchiseId,
            ...(baseRole === "TECHNICIAN" || baseRole === "QUALITY_INSPECTOR" ? { technicianId: user.id } : {})
        };
    }
    async updateProfile(userId, data) {
        const user = await authRepository.findEmployeeById(userId);
        if (!user)
            throw new Error("User not found");
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone
        };
        if (data.newPassword && data.currentPassword) {
            if (!user.password)
                throw new Error("User has no password set");
            const isValid = await bcrypt.compare(data.currentPassword, user.password);
            if (!isValid) {
                throw new Error("Current password incorrect");
            }
            updateData.password = await bcrypt.hash(data.newPassword, 10);
        }
        return authRepository.updateEmployee(userId, updateData);
    }
    async getRolePermissions() {
        return authRepository.findAllRolePermissions();
    }
    async updateRolePermissions(role, permissions) {
        return authRepository.upsertRolePermission(role, permissions);
    }
}
export const authService = new AuthService();
//# sourceMappingURL=auth.service.js.map