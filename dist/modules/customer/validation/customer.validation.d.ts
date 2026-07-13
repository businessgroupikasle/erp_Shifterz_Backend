import { z } from 'zod';
export declare const createCustomerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        vehicle: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>['body'];
//# sourceMappingURL=customer.validation.d.ts.map