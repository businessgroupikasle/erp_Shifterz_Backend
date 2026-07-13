import { z } from 'zod';
export const createOutpassSchema = z.object({
    body: z.object({
        vehicle: z.string().min(1, "Vehicle is required"),
        model: z.string().optional(),
        customer: z.string().optional(),
        phone: z.string().optional(),
        service: z.string().optional(),
        outTime: z.string().optional(),
        securityName: z.string().optional(),
        technicianName: z.string().optional(),
        remarks: z.string().optional(),
        carInId: z.string().optional(),
    })
});
export const updateOutpassSchema = z.object({
    body: z.object({
        vehicle: z.string().optional(),
        model: z.string().optional(),
        customer: z.string().optional(),
        phone: z.string().optional(),
        service: z.string().optional(),
        outTime: z.string().optional(),
        securityName: z.string().optional(),
        technicianName: z.string().optional(),
        remarks: z.string().optional(),
    })
});
//# sourceMappingURL=outpass.validation.js.map