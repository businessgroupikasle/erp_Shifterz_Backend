import { PaymentsService } from '../service/payments.service.js';
export class PaymentsController {
    service;
    constructor(service = new PaymentsService()) {
        this.service = service;
    }
    getAllPayments = async (req, res, next) => {
        try {
            const list = await this.service.getAllPayments();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createPayment = async (req, res, next) => {
        try {
            const result = await this.service.createPayment(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deletePayment = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deletePayment(id);
            res.json({ success: true, message: "Payment deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=payments.controller.js.map