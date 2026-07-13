import { InventoryRepository } from '../repository/inventory.repository.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
export class InventoryService {
    repository;
    constructor(repository = new InventoryRepository()) {
        this.repository = repository;
    }
    async getAllItems() {
        return this.repository.findAll();
    }
    async createItem(data) {
        const itmId = generateUid("ITM");
        return this.repository.create(itmId, data);
    }
    async updateItem(id, data) {
        return this.repository.update(id, data);
    }
    async deleteItem(id) {
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=inventory.service.js.map