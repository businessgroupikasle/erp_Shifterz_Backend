import { z } from 'zod';
export declare const createTransferSchema: z.ZodObject<{
    body: z.ZodObject<{
        employeeId: z.ZodOptional<z.ZodString>;
        toFranchiseId: z.ZodOptional<z.ZodString>;
        newMemberName: z.ZodOptional<z.ZodString>;
        newMemberPhone: z.ZodOptional<z.ZodString>;
        newMemberEmail: z.ZodOptional<z.ZodString>;
        panNumber: z.ZodOptional<z.ZodString>;
        aadharNumber: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        panDocUrl: z.ZodOptional<z.ZodString>;
        aadharDocUrl: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateTransferSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodString>;
        toFranchiseId: z.ZodOptional<z.ZodString>;
        newMemberName: z.ZodOptional<z.ZodString>;
        newMemberPhone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateTransferDTO = z.infer<typeof createTransferSchema>['body'];
export type UpdateTransferDTO = z.infer<typeof updateTransferSchema>['body'];
//# sourceMappingURL=transfer.validation.d.ts.map