import { Router } from 'express';
import { TransferController } from '../controller/transfer.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createTransferSchema, updateTransferSchema } from '../validation/transfer.validation.js';

export const transferRouter = Router();
const controller = new TransferController();

transferRouter.use(authenticate);

transferRouter.get('/', controller.getAllTransfers);
transferRouter.post('/', validate(createTransferSchema), controller.createTransfer);
transferRouter.post('/:id/approve', controller.approveTransfer);
transferRouter.post('/:id/reject', controller.rejectTransfer);
transferRouter.put('/:id', validate(updateTransferSchema), controller.updateTransfer);
transferRouter.delete('/:id', controller.deleteTransfer);
