import { db } from '../../../lib/db.js';
export class FranchiseRepository {
    async findAll() {
        return db.franchise.findMany({
            where: { isDeleted: false },
            orderBy: { since: 'asc' }
        });
    }
    async findById(id) {
        return db.franchise.findFirst({
            where: { id, isDeleted: false }
        });
    }
    async create(id, data) {
        return db.franchise.create({
            data: {
                id,
                name: data.name,
                city: data.city,
                owner: data.owner,
                phone: data.phone,
                since: new Date().toISOString(),
                revenue: data.revenue || 0,
                jobs: data.jobs || 0,
                royaltyPct: data.royaltyPct || 0,
                status: data.status || "Active",
                businessName: data.businessName || null,
                gstNumber: data.gstNumber || null,
                email: data.email || null,
                address: data.address || null,
                state: data.state || null,
                pinCode: data.pinCode || null,
                licenseStatus: data.licenseStatus || "Active"
            }
        });
    }
    async update(id, data) {
        return db.franchise.update({
            where: { id },
            data
        });
    }
    async softDelete(id) {
        return db.franchise.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date().toISOString() }
        });
    }
}
//# sourceMappingURL=franchise.repository.js.map