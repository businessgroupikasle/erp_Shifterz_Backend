import { z } from 'zod';

export const updateSettingSchema = z.object({
  body: z.object({
    companyName: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    gstin: z.string().optional(),
    gstPct: z.number().optional(),
    currency: z.string().optional(),
    agents: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    securityGuards: z.array(z.string()).optional()
  })
});

export type UpdateSettingDTO = z.infer<typeof updateSettingSchema>['body'];
