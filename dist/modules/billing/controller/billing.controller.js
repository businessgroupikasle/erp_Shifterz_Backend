import { BillingService } from '../service/billing.service.js';
export class BillingController {
    service;
    constructor(service = new BillingService()) {
        this.service = service;
    }
    getAllInvoices = async (req, res, next) => {
        try {
            const list = await this.service.getAllInvoices();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createInvoice = async (req, res, next) => {
        try {
            const result = await this.service.createInvoice(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateInvoice = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateInvoice(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteInvoice = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteInvoice(id);
            res.json({ success: true, message: "Invoice deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=billing.controller.js.map