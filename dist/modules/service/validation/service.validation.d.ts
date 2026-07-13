import { z } from 'zod';
export declare const createServiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        category: z.ZodString;
        price: z.ZodNumber;
        duration: z.ZodString;
        warranty: z.ZodOptional<z.ZodString>;
        desc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateServiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodString>;
        warranty: z.ZodOptional<z.ZodString>;
        desc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateServiceDTO = z.infer<typeof createServiceSchema>['body'];
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>['body'];
//# sourceMappingURL=service.validation.d.ts.map