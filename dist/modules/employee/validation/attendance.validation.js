import { z } from 'zod';
export const checkInSchema = z.object({
    body: z.object({
        employeeId: z.string().min(1, "Employee ID is required"),
    })
});
export const checkOutSchema = z.object({
    body: z.object({
        employeeId: z.string().min(1, "Employee ID is required"),
    })
});
export const updateAttendanceSchema = z.object({
    body: z.object({
        status: z.string().optional(),
        clockIn: z.string().nullable().optional(),
        clockOut: z.string().nullable().optional(),
    })
});
//# sourceMappingURL=attendance.validation.js.map