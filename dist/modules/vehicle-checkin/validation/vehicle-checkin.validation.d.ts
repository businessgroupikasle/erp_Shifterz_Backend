import { z } from 'zod';
export declare const createCheckinSchema: z.ZodObject<{
    body: z.ZodObject<{
        vehicle: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        customer: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        technicianIn: z.ZodOptional<z.ZodString>;
        inTime: z.ZodOptional<z.ZodString>;
        odometer: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateCheckinSchema: z.ZodObject<{
    body: z.ZodObject<{
        vehicle: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        customer: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        technicianIn: z.ZodOptional<z.ZodString>;
        odometer: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const checkoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        securityName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateCheckinDTO = z.infer<typeof createCheckinSchema>['body'];
export type UpdateCheckinDTO = z.infer<typeof updateCheckinSchema>['body'];
export type CheckoutDTO = z.infer<typeof checkoutSchema>['body'];
//# sourceMappingURL=vehicle-checkin.validation.d.ts.map