import { z } from 'zod';
export declare const createInvoiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        type: z.ZodString;
        client: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        vehicle: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        amount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        gst: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        discount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        status: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodString>;
        dueDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        gstNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        items: z.ZodOptional<z.ZodAny>;
        bankDetails: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        paymentTerms: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        deliveryTerms: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        authorizedSignatory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateInvoiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        dueDate: z.ZodOptional<z.ZodString>;
        amount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        gst: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        discount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        type: z.ZodOptional<z.ZodString>;
        client: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        vehicle: z.ZodOptional<z.ZodString>;
        service: z.ZodOptional<z.ZodString>;
        items: z.ZodOptional<z.ZodAny>;
        bankDetails: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        paymentTerms: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        deliveryTerms: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        authorizedSignatory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        modifiedBy: z.ZodOptional<z.ZodString>;
        cancelledBy: z.ZodOptional<z.ZodString>;
        approvedBy: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateInvoiceDTO = z.infer<typeof createInvoiceSchema>['body'];
export type UpdateInvoiceDTO = z.infer<typeof updateInvoiceSchema>['body'];
//# sourceMappingURL=billing.validation.d.ts.map