import { z } from 'zod';
export declare const createLeadSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        source: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        vehicle: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        budget: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        date: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateLeadSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
        source: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        service: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        vehicle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        assignedTo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        budget: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        date: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=lead.validation.d.ts.map