import { Router } from 'express';
import { InventoryController } from '../controller/inventory.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createInventorySchema, updateInventorySchema } from '../validation/inventory.validation.js';
export const inventoryRouter = Router();
const controller = new InventoryController();
inventoryRouter.use(authenticate);
inventoryRouter.get('/', controller.getAllItems);
inventoryRouter.post('/', validate(createInventorySchema), controller.createItem);
inventoryRouter.put('/:id', validate(updateInventorySchema), controller.updateItem);
inventoryRouter.delete('/:id', controller.deleteItem);
//# sourceMappingURL=inventory.routes.js.map