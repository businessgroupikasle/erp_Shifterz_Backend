import { db } from '../../../lib/db.js';
export class JobCardRepository {
    async findAll(filter) {
        return db.job.findMany({
            where: filter,
            orderBy: { createdAt: "desc" },
        });
    }
    async findEmployeeByName(name) {
        return db.employee.findFirst({ where: { name } });
    }
    async create(id, data, techId) {
        return db.job.create({
            data: {
                id,
                vehicle: data.vehicle,
                customer: data.customer || "",
                service: data.service || "",
                technician: data.technician || "",
                technicianId: techId,
                status: data.status || "Pending",
                priority: data.priority || "Normal",
                startDate: data.startDate || new Date().toISOString().slice(0, 10),
                estCompletion: data.estCompletion || new Date().toISOString().slice(0, 10),
                actualCompletion: null,
                notes: data.notes || "",
                photos: data.photos || [],
            },
        });
    }
    async update(id, data) {
        return db.job.update({
            where: { id },
            data: {
                technician: data.technician,
                technicianId: data.technicianId,
                status: data.status,
                priority: data.priority,
                estCompletion: data.estCompletion,
                actualCompletion: data.actualCompletion || null,
                notes: data.notes,
                photos: data.photos,
            },
        });
    }
    async softDelete(id) {
        return db.job.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date().toISOString() },
        });
    }
}
//# sourceMappingURL=job-card.repository.js.map