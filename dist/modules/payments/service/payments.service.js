import { PaymentsRepository } from '../repository/payments.repository.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
export class PaymentsService {
    repository;
    constructor(repository = new PaymentsRepository()) {
        this.repository = repository;
    }
    async getAllPayments() {
        return this.repository.findAll();
    }
    async createPayment(data) {
        const invoice = await this.repository.findInvoiceById(data.invoiceId);
        if (!invoice) {
            throw new NotFoundError("Invoice not found");
        }
        const payId = generateUid("PAY");
        const newPayment = await this.repository.create(payId, data, invoice.client);
        // Check total payments for this invoice
        const allPays = await this.repository.findPaymentsByInvoiceId(data.invoiceId);
        const totalPaid = allPays.reduce((sum, p) => sum + p.amount, 0);
        const invoiceTotal = invoice.amount + invoice.gst - invoice.discount;
        if (totalPaid >= invoiceTotal) {
            await this.repository.updateInvoiceStatus(data.invoiceId, "Paid");
        }
        // Update customer spend
        const cust = await this.repository.findCustomerByPhone(invoice.phone);
        if (cust) {
            await this.repository.incrementCustomerSpend(cust.id, Number(data.amount || 0));
        }
        return newPayment;
    }
    async deletePayment(id) {
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=payments.service.js.map