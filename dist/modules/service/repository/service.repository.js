import { db } from '../../../lib/db.js';
export class ServiceRepository {
    async findAll() {
        return db.service.findMany({
            where: { isDeleted: false }
        });
    }
    async findById(id) {
        return db.service.findFirst({
            where: { id, isDeleted: false }
        });
    }
    async create(id, data) {
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
    async update(id, data) {
        return db.service.update({
            where: { id },
            data
        });
    }
    async softDelete(id) {
        return db.service.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date().toISOString() }
        });
    }
}
//# sourceMappingURL=service.repository.js.map