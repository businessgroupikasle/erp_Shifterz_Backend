import { TransferService } from '../service/transfer.service.js';
export class TransferController {
    service;
    constructor(service = new TransferService()) {
        this.service = service;
    }
    getAllTransfers = async (req, res, next) => {
        try {
            const list = await this.service.getAllTransfers();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createTransfer = async (req, res, next) => {
        try {
            const username = req.user?.id || ""; // Usually we extract username, fallback to id
            const role = req.user?.role || "UNKNOWN";
            const result = await this.service.createTransfer(req.body, username, role);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    approveTransfer = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const role = req.user?.role || "UNKNOWN";
            const result = await this.service.approveTransfer(id, role);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    rejectTransfer = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const role = req.user?.role || "UNKNOWN";
            const result = await this.service.rejectTransfer(id, role);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateTransfer = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateTransfer(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteTransfer = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteTransfer(id);
            res.json({ success: true, message: "Deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=transfer.controller.js.map