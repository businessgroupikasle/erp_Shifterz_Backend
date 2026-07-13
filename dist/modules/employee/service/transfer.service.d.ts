import { TransferRepository } from '../repository/transfer.repository.js';
import type { CreateTransferDTO, UpdateTransferDTO } from '../validation/transfer.validation.js';
export declare class TransferService {
    private readonly repository;
    constructor(repository?: TransferRepository);
    getAllTransfers(): Promise<{
        employeeName: string;
        employeeRole: string;
        toFranchiseName: string;
        toFranchiseCity: string;
        id: string;
        username: string | null;
        status: string;
        password: string | null;
        role: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        toFranchiseId: string | null;
        newMemberName: string | null;
        newMemberPhone: string | null;
        newMemberEmail: string | null;
        fromFranchiseId: string | null;
        requestedBy: string;
    }[]>;
    createTransfer(data: CreateTransferDTO, username: string, role: string): Promise<{
        id: string;
        username: string | null;
        status: string;
        password: string | null;
        role: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        toFranchiseId: string | null;
        newMemberName: string | null;
        newMemberPhone: string | null;
        newMemberEmail: string | null;
        fromFranchiseId: string | null;
        requestedBy: string;
    }>;
    approveTransfer(id: string, userRole: string): Promise<{
        success: boolean;
        message: string;
    }>;
    rejectTransfer(id: string, userRole: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateTransfer(id: string, data: UpdateTransferDTO): Promise<{
        id: string;
        username: string | null;
        status: string;
        password: string | null;
        role: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        toFranchiseId: string | null;
        newMemberName: string | null;
        newMemberPhone: string | null;
        newMemberEmail: string | null;
        fromFranchiseId: string | null;
        requestedBy: string;
    }>;
    deleteTransfer(id: string): Promise<{
        id: string;
        username: string | null;
        status: string;
        password: string | null;
        role: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        toFranchiseId: string | null;
        newMemberName: string | null;
        newMemberPhone: string | null;
        newMemberEmail: string | null;
        fromFranchiseId: string | null;
        requestedBy: string;
    }>;
}
//# sourceMappingURL=transfer.service.d.ts.map