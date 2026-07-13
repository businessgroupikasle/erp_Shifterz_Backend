import { z } from 'zod';
export declare const createJobCardSchema: z.ZodObject<{
    body: z.ZodObject<{
        vehicle: z.ZodString;
        customer: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        technician: z.ZodOptional<z.ZodString>;
        technicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        estCompletion: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        photos: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateJobCardSchema: z.ZodObject<{
    body: z.ZodObject<{
        technician: z.ZodOptional<z.ZodString>;
        technicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodString>;
        estCompletion: z.ZodOptional<z.ZodString>;
        actualCompletion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        notes: z.ZodOptional<z.ZodString>;
        photos: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateJobCardDTO = z.infer<typeof createJobCardSchema>['body'];
export type UpdateJobCardDTO = z.infer<typeof updateJobCardSchema>['body'];
//# sourceMappingURL=job-card.validation.d.ts.map