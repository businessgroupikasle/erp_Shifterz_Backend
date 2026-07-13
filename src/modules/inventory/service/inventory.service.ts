import { InventoryRepository } from '../repository/inventory.repository.js';
import type { CreateInventoryDTO, UpdateInventoryDTO } from '../validation/inventory.validation.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';

export class InventoryService {
  constructor(private readonly repository: InventoryRepository = new InventoryRepository()) {}

  async getAllItems() {
    return this.repository.findAll();
  }

  async createItem(data: CreateInventoryDTO) {
    const itmId = generateUid("ITM");
    return this.repository.create(itmId, data);
  }

  async updateItem(id: string, data: UpdateInventoryDTO) {
    return this.repository.update(id, data);
  }

  async deleteItem(id: string) {
    return this.repository.softDelete(id);
  }
}
