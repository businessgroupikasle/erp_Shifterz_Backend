import { z } from 'zod';
export declare const createPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        invoiceId: z.ZodString;
        amount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        mode: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodString>;
        ref: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>['body'];
//# sourceMappingURL=payments.validation.d.ts.map