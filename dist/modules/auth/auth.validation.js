import { z } from "zod";
export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    }),
});
export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email("Invalid email").optional(),
        phone: z.string().optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
    }).refine(data => {
        if (data.newPassword && !data.currentPassword)
            return false;
        return true;
    }, {
        message: "Current password is required to set a new password",
        path: ["currentPassword"]
    }),
});
export const updateRolePermissionsSchema = z.object({
    body: z.object({
        permissions: z.array(z.string()).min(1, "At least one permission is required"),
    }),
    params: z.object({
        role: z.string().min(1, "Role is required"),
    }),
});
//# sourceMappingURL=auth.validation.js.map