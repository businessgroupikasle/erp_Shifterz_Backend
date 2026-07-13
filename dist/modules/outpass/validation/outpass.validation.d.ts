import { z } from 'zod';
export declare const createOutpassSchema: z.ZodObject<{
    body: z.ZodObject<{
        vehicle: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        customer: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        outTime: z.ZodOptional<z.ZodString>;
        securityName: z.ZodOptional<z.ZodString>;
        technicianName: z.ZodOptional<z.ZodString>;
        remarks: z.ZodOptional<z.ZodString>;
        carInId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateOutpassSchema: z.ZodObject<{
    body: z.ZodObject<{
        vehicle: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        customer: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        outTime: z.ZodOptional<z.ZodString>;
        securityName: z.ZodOptional<z.ZodString>;
        technicianName: z.ZodOptional<z.ZodString>;
        remarks: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateOutpassDTO = z.infer<typeof createOutpassSchema>['body'];
export type UpdateOutpassDTO = z.infer<typeof updateOutpassSchema>['body'];
//# sourceMappingURL=outpass.validation.d.ts.map