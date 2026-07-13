import { z } from 'zod';
export const createInventorySchema = z.object({
    body: z.object({
        name: z.string().min(1, "Item name is required"),
        unit: z.string().optional(),
        category: z.string().optional(),
        stock: z.union([z.string(), z.number()]).optional(),
        reorder: z.union([z.string(), z.number()]).optional(),
        cost: z.union([z.string(), z.number()]).optional(),
        supplier: z.string().optional(),
        location: z.string().optional(),
    })
});
export const updateInventorySchema = z.object({
    body: z.object({
        name: z.string().optional(),
        unit: z.string().optional(),
        category: z.string().optional(),
        stock: z.union([z.string(), z.number()]).optional(),
        reorder: z.union([z.string(), z.number()]).optional(),
        cost: z.union([z.string(), z.number()]).optional(),
        supplier: z.string().optional(),
        location: z.string().optional(),
    })
});
//# sourceMappingURL=inventory.validation.js.map