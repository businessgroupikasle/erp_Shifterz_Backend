import { z } from 'zod';
export declare const createInventorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        unit: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        stock: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        reorder: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        supplier: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateInventorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        stock: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        reorder: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        cost: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        supplier: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateInventoryDTO = z.infer<typeof createInventorySchema>['body'];
export type UpdateInventoryDTO = z.infer<typeof updateInventorySchema>['body'];
//# sourceMappingURL=inventory.validation.d.ts.map