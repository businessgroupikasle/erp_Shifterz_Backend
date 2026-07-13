import { Router } from 'express';
import { AttendanceController } from '../controller/attendance.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { checkInSchema, checkOutSchema, updateAttendanceSchema } from '../validation/attendance.validation.js';

export const attendanceRouter = Router();
const controller = new AttendanceController();

attendanceRouter.use(authenticate);

attendanceRouter.get('/', controller.getAllAttendance);
attendanceRouter.post('/check-in', validate(checkInSchema), controller.checkIn);
attendanceRouter.put('/check-out', validate(checkOutSchema), controller.checkOut);
attendanceRouter.put('/:id', validate(updateAttendanceSchema), controller.updateAttendance);
