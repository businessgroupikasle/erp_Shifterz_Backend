import { db } from '../../../lib/db.js';
export class EmployeeRepository {
    async findAllEmployees(tenantFilter) {
        return db.employee.findMany({
            where: tenantFilter,
            orderBy: { id: "asc" },
            include: {
                franchise: { select: { id: true, name: true, city: true } },
                permission: true
            }
        });
    }
    async findHqEmployees() {
        return db.employee.findMany({
            where: {
                franchiseId: null,
                isDeleted: false,
                status: "Active"
            },
            orderBy: { name: "asc" }
        });
    }
    async findTechnicians() {
        return db.employee.findMany(); // The original GET /technicians returned all employees for some reason
    }
    async countFranchiseUsers(franchiseId) {
        return db.employee.count({ where: { franchiseId } });
    }
    async create(id, data, hashedPassword, normalizedUsername) {
        return db.employee.create({
            data: {
                id,
                name: data.name,
                phone: data.phone || null,
                email: data.email || null,
                status: data.status || "Active",
                username: normalizedUsername,
                password: hashedPassword,
                role: data.role || "TECHNICIAN",
                franchiseId: data.franchiseId,
                permission: {
                    create: {
                        modules: data.permissions || [],
                    }
                }
            },
            include: {
                permission: true
            }
        });
    }
    async update(id, data) {
        return db.employee.update({
            where: { id },
            data,
            include: {
                permission: true
            }
        });
    }
    async updatePermissions(employeeId, modules) {
        return db.userPermission.upsert({
            where: { employeeId },
            update: { modules },
            create: { employeeId, modules }
        });
    }
    async softDelete(id) {
        return db.employee.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date().toISOString() }
        });
    }
}
//# sourceMappingURL=employee.repository.js.map