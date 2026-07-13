import { db } from '../../../lib/db.js';
import type { CreateServiceDTO, UpdateServiceDTO } from '../validation/service.validation.js';

export class ServiceRepository {
  async findAll() {
    return db.service.findMany({
      where: { isDeleted: false }
    });
  }

  async findById(id: string) {
    return db.service.findFirst({
      where: { id, isDeleted: false }
    });
  }

  async create(id: string, data: CreateServiceDTO) {
    return db.service.create({
      data: {
        id,
        name: data.name,
        category: data.category,
        price: data.price,
        duration: data.duration,
        warranty: data.warranty || "",
        desc: data.desc || ""
      }
    });
  }

  async update(id: string, data: UpdateServiceDTO) {
    return db.service.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return db.service.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date().toISOString() }
    });
  }
}
