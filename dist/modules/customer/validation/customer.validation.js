import { z } from 'zod';
export const createCustomerSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().optional(),
        email: z.string().email("Invalid email").optional().or(z.literal("")),
        vehicle: z.string().optional(),
        model: z.string().optional(),
    })
});
//# sourceMappingURL=customer.validation.js.map