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

export type CheckInDTO = z.infer<typeof checkInSchema>['body'];
export type CheckOutDTO = z.infer<typeof checkOutSchema>['body'];
export type UpdateAttendanceDTO = z.infer<typeof updateAttendanceSchema>['body'];
