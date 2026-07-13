import { z } from 'zod';
export const createLeadSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().optional(),
        email: z.string().email("Invalid email").optional().or(z.literal("")),
        source: z.string().optional(),
        service: z.string().optional(),
        vehicle: z.string().optional(),
        assignedTo: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
        budget: z.union([z.string(), z.number()]).optional(),
        date: z.string().optional(),
    })
});
export const updateLeadSchema = z.object({
    body: createLeadSchema.shape.body.partial()
});
//# sourceMappingURL=lead.validation.js.map