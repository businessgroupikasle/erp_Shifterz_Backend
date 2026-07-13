import { z } from 'zod';
export declare const createEmployeeSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodString>;
        franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateEmployeeSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodString>;
        franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>['body'];
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>['body'];
//# sourceMappingURL=employee.validation.d.ts.map