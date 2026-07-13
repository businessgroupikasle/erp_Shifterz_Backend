import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().min(1, "Invoice ID is required"),
    amount: z.union([z.string(), z.number()]).optional(),
    mode: z.string().optional(),
    date: z.string().optional(),
    ref: z.string().optional(),
    notes: z.string().optional(),
    createdBy: z.string().nullable().optional(),
  })
});

export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>['body'];
