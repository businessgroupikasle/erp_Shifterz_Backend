import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Service name is required"),
    category: z.string().min(1, "Category is required"),
    price: z.number().min(0, "Price must be a positive number"),
    duration: z.string().min(1, "Duration is required"),
    warranty: z.string().optional(),
    desc: z.string().optional()
  })
});

export const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    price: z.number().optional(),
    duration: z.string().optional(),
    warranty: z.string().optional(),
    desc: z.string().optional()
  })
});

export type CreateServiceDTO = z.infer<typeof createServiceSchema>['body'];
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>['body'];
