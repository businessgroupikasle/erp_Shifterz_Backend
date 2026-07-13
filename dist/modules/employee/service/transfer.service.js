import { TransferRepository } from '../repository/transfer.repository.js';
import { ApiError } from '../../../shared/errors/ApiError.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
import bcrypt from 'bcrypt';
export class TransferService {
    repository;
    constructor(repository = new TransferRepository()) {
        this.repository = repository;
    }
    async getAllTransfers() {
        const requests = await this.repository.findAll();
        return Promise.all(requests.map(async (r) => {
            let empName = r.newMemberName || "Unknown";
            let empRole = r.role || "TECHNICIAN";
            if (r.employeeId) {
                const emp = await this.repository.findEmployeeById(r.employeeId);
                if (emp) {
                    empName = emp.name;
                    empRole = emp.role;
                }
            }
            let toFranchise = null;
            if (r.toFranchiseId) {
                toFranchise = await this.repository.findFranchiseById(r.toFranchiseId);
            }
            return {
                ...r,
                employeeName: empName,
                employeeRole: empRole,
                toFranchiseName: toFranchise?.name || "Unknown",
                toFranchiseCity: toFranchise?.city || "Unknown"
            };
        }));
    }
    async createTransfer(data, username, role) {
        const requester = username || role || "Admin";
        return this.repository.create(data, requester);
    }
    async approveTransfer(id, userRole) {
        const request = await this.repository.findRequestById(id);
        if (!request)
            throw new NotFoundError("Transfer request not found");
        if (request.status !== "Pending")
            throw new ApiError(400, `Request already ${request.status.toLowerCase()}`);
        if (userRole !== "SUPER_ADMIN" && userRole !== "HQ_USER")
            throw new ApiError(403, "Only HQ can approve member transfers");
        await this.repository.updateRequestStatus(id, "Approved");
        if (request.employeeId) {
            // Existing employee
            await this.repository.updateEmployeeFranchise(request.employeeId, request.toFranchiseId);
        }
        else {
            // New member creation
            const empId = `EMP${Date.now().toString().slice(-6)}`;
            const rawPassword = request.password || "pass123";
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            const normalizedUsername = request.username ? String(request.username).trim().toLowerCase() : null;
            await this.repository.createEmployeeFromTransfer({
                empId,
                name: request.newMemberName || "New Member",
                phone: request.newMemberPhone || null,
                email: request.newMemberEmail || null,
                username: normalizedUsername,
                password: hashedPassword,
                role: request.role || "TECHNICIAN",
                franchiseId: request.toFranchiseId || null
            });
        }
        return { success: true, message: "Request approved and user provisioned." };
    }
    async rejectTransfer(id, userRole) {
        const request = await this.repository.findRequestById(id);
        if (!request)
            throw new NotFoundError("Transfer request not found");
        if (request.status !== "Pending")
            throw new ApiError(400, `Request already ${request.status.toLowerCase()}`);
        if (userRole !== "SUPER_ADMIN" && userRole !== "HQ_USER")
            throw new ApiError(403, "Only HQ can reject member transfers");
        await this.repository.updateRequestStatus(id, "Rejected");
        return { success: true, message: "Request rejected" };
    }
    async updateTransfer(id, data) {
        return this.repository.updateRequest(id, data);
    }
    async deleteTransfer(id) {
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=transfer.service.js.map