import { z } from 'zod';
export const createTransferSchema = z.object({
    body: z.object({
        employeeId: z.string().optional(),
        toFranchiseId: z.string().optional(),
        newMemberName: z.string().optional(),
        newMemberPhone: z.string().optional(),
        newMemberEmail: z.string().optional(),
        panNumber: z.string().optional(),
        aadharNumber: z.string().optional(),
        address: z.string().optional(),
        panDocUrl: z.string().optional(),
        aadharDocUrl: z.string().optional(),
        username: z.string().optional(),
        password: z.string().optional(),
        role: z.string().optional(),
    })
});
export const updateTransferSchema = z.object({
    body: z.object({
        status: z.string().optional(),
        role: z.string().optional(),
        toFranchiseId: z.string().optional(),
        newMemberName: z.string().optional(),
        newMemberPhone: z.string().optional(),
    })
});
//# sourceMappingURL=transfer.validation.js.map