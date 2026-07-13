import { InventoryService } from '../service/inventory.service.js';
export class InventoryController {
    service;
    constructor(service = new InventoryService()) {
        this.service = service;
    }
    getAllItems = async (req, res, next) => {
        try {
            const list = await this.service.getAllItems();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createItem = async (req, res, next) => {
        try {
            const result = await this.service.createItem(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateItem = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateItem(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteItem = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteItem(id);
            res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=inventory.controller.js.map