import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        currentPassword: z.ZodOptional<z.ZodString>;
        newPassword: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateRolePermissionsSchema: z.ZodObject<{
    body: z.ZodObject<{
        permissions: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        role: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=auth.validation.d.ts.map