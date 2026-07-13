import { db } from '../../../lib/db.js';
export class LeadRepository {
    async findAll(tenantFilter) {
        return db.lead.findMany({ where: tenantFilter, orderBy: { date: "desc" } });
    }
    async findById(id) {
        return db.lead.findUnique({ where: { id } });
    }
    async create(data) {
        return db.lead.create({ data });
    }
    async update(id, data) {
        return db.lead.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        return db.lead.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date().toISOString() },
        });
    }
    async findCustomerByPhone(phone) {
        return db.customer.findFirst({ where: { phone } });
    }
    async createCustomer(data) {
        return db.customer.create({ data });
    }
    async deleteCustomer(id) {
        return db.customer.delete({ where: { id } });
    }
}
//# sourceMappingURL=lead.repository.js.map