import { z } from 'zod';
export declare const createFranchiseSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        city: z.ZodString;
        owner: z.ZodString;
        phone: z.ZodString;
        revenue: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        jobs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        royaltyPct: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        businessName: z.ZodOptional<z.ZodString>;
        gstNumber: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        pinCode: z.ZodOptional<z.ZodString>;
        licenseStatus: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateFranchiseSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        owner: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        revenue: z.ZodOptional<z.ZodNumber>;
        jobs: z.ZodOptional<z.ZodNumber>;
        royaltyPct: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        businessName: z.ZodOptional<z.ZodString>;
        gstNumber: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        pinCode: z.ZodOptional<z.ZodString>;
        licenseStatus: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateFranchiseDTO = z.infer<typeof createFranchiseSchema>['body'];
export type UpdateFranchiseDTO = z.infer<typeof updateFranchiseSchema>['body'];
//# sourceMappingURL=franchise.validation.d.ts.map