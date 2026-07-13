import { db } from '../../../lib/db.js';
export class VehicleCheckinRepository {
    async findAll() {
        return db.carIn.findMany({ orderBy: { inTime: "desc" } });
    }
    async findById(id) {
        return db.carIn.findUnique({ where: { id } });
    }
    async create(id, data, jobCardId, franchiseId) {
        return db.carIn.create({
            data: {
                id,
                vehicle: data.vehicle,
                model: data.model || "",
                customer: data.customer || "",
                phone: data.phone || "",
                service: data.service || "",
                technicianIn: data.technicianIn || "",
                inTime: data.inTime || new Date().toISOString(),
                outTime: null,
                status: "In Workshop",
                odometer: String(data.odometer || "0"),
                notes: data.notes || "",
                jobCardId,
                franchiseId,
            },
        });
    }
    async update(id, data) {
        return db.carIn.update({
            where: { id },
            data: {
                vehicle: data.vehicle,
                model: data.model,
                customer: data.customer,
                phone: data.phone,
                service: data.service,
                technicianIn: data.technicianIn,
                odometer: data.odometer ? String(data.odometer) : undefined,
                notes: data.notes,
            },
        });
    }
    async checkout(id, outTime) {
        return db.carIn.update({
            where: { id },
            data: { outTime, status: "Delivered" },
        });
    }
    async delete(id) {
        return db.carIn.delete({ where: { id } });
    }
    // Related auto-creation methods
    async createJobCard(data) {
        return db.job.create({ data });
    }
    async updateJobCard(id, data) {
        return db.job.update({ where: { id }, data });
    }
    async findCustomerByPhone(phone) {
        return db.customer.findFirst({ where: { phone } });
    }
    async updateCustomerVisits(id, visits, lastVisit) {
        return db.customer.update({ where: { id }, data: { visits, lastVisit } });
    }
    async createCustomer(data) {
        return db.customer.create({ data });
    }
    async findOutpassByCarInId(carInId) {
        return db.outPass.findFirst({ where: { carInId } });
    }
    async createOutpass(data) {
        return db.outPass.create({ data });
    }
    async deleteOutpassesByCarInId(carInId) {
        return db.outPass.deleteMany({ where: { carInId } });
    }
}
//# sourceMappingURL=vehicle-checkin.repository.js.map