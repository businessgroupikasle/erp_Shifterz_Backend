import { z } from 'zod';
export declare const updateSettingSchema: z.ZodObject<{
    body: z.ZodObject<{
        companyName: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        gstin: z.ZodOptional<z.ZodString>;
        gstPct: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodOptional<z.ZodString>;
        agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        securityGuards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateSettingDTO = z.infer<typeof updateSettingSchema>['body'];
//# sourceMappingURL=settings.validation.d.ts.map