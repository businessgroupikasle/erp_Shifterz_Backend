import { z } from 'zod';
export declare const checkInSchema: z.ZodObject<{
    body: z.ZodObject<{
        employeeId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const checkOutSchema: z.ZodObject<{
    body: z.ZodObject<{
        employeeId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateAttendanceSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodString>;
        clockIn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        clockOut: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CheckInDTO = z.infer<typeof checkInSchema>['body'];
export type CheckOutDTO = z.infer<typeof checkOutSchema>['body'];
export type UpdateAttendanceDTO = z.infer<typeof updateAttendanceSchema>['body'];
//# sourceMappingURL=attendance.validation.d.ts.map