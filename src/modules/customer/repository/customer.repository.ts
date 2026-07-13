import { db } from '../../../lib/db.js';
import type { CreateCustomerDTO } from '../validation/customer.validation.js';

export class CustomerRepository {
  async findAll(tenantFilter: any) {
    return db.customer.findMany({
      where: {
        ...tenantFilter,
        isDeleted: false,
      },
      orderBy: { totalSpend: "desc" },
    });
  }

  async create(id: string, data: CreateCustomerDTO, franchiseId: string | null) {
    return db.customer.create({
      data: {
        id,
        name: data.name,
        phone: data.phone || "",
        email: data.email || "",
        vehicle: data.vehicle || "",
        model: data.model || "",
        visits: 0,
        totalSpend: 0,
        lastVisit: new Date().toISOString().slice(0, 10),
        franchiseId,
      },
    });
  }

  async softDelete(id: string) {
    return db.customer.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date().toISOString() },
    });
  }
}
