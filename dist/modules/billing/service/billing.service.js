import { BillingRepository } from '../repository/billing.repository.js';
export class BillingService {
    repository;
    constructor(repository = new BillingRepository()) {
        this.repository = repository;
    }
    async getAllInvoices() {
        const list = await this.repository.findAll();
        const payments = await this.repository.findAllPayments();
        return list.map(inv => {
            const invPayments = payments.filter(p => p.invoiceId === inv.id);
            const paidAmount = invPayments.reduce((sum, p) => sum + p.amount, 0);
            return { ...inv, paidAmount };
        });
    }
    async createInvoice(data) {
        const date = new Date(data.date || Date.now());
        const year = date.getFullYear();
        const month = date.getMonth();
        const startYear = month >= 3 ? year : year - 1;
        const endYear = startYear + 1;
        const fy = `${startYear.toString().slice(2)}-${endYear.toString().slice(2)}`;
        const docTypePrefix = {
            Invoice: `STZ-${fy}-`,
            Quotation: `STZ-QT-${fy}-`,
            Estimate: `STZ-EST-${fy}-`,
        }[data.type] || `STZ-DOC-${fy}-`;
        const maxId = await this.repository.findMaxIdForPrefix(docTypePrefix);
        const invId = `${docTypePrefix}${maxId + 1}`;
        return this.repository.create(invId, data);
    }
    async updateInvoice(id, data) {
        const existing = await this.repository.findById(id);
        const auditData = {};
        if (data.modifiedBy)
            auditData.modifiedBy = data.modifiedBy;
        if (data.status === "Cancelled" && existing?.status !== "Cancelled")
            auditData.cancelledBy = data.modifiedBy || data.cancelledBy;
        if (data.status === "Approved" && existing?.status !== "Approved")
            auditData.approvedBy = data.modifiedBy || data.approvedBy;
        const updateData = {
            ...auditData,
            status: data.status !== undefined ? data.status : undefined,
            notes: data.notes !== undefined ? data.notes : undefined,
            dueDate: data.dueDate !== undefined ? data.dueDate : undefined,
            amount: data.amount !== undefined ? Number(data.amount) : undefined,
            gst: data.gst !== undefined ? Number(data.gst) : undefined,
            discount: data.discount !== undefined ? Number(data.discount) : undefined,
            type: data.type !== undefined ? data.type : undefined,
            client: data.client !== undefined ? data.client : undefined,
            phone: data.phone !== undefined ? data.phone : undefined,
            vehicle: data.vehicle !== undefined ? data.vehicle : undefined,
            service: data.service !== undefined ? data.service : undefined,
            items: data.items !== undefined ? data.items : undefined,
            bankDetails: data.bankDetails !== undefined ? data.bankDetails : undefined,
            paymentTerms: data.paymentTerms !== undefined ? data.paymentTerms : undefined,
            deliveryTerms: data.deliveryTerms !== undefined ? data.deliveryTerms : undefined,
            authorizedSignatory: data.authorizedSignatory !== undefined ? data.authorizedSignatory : undefined,
        };
        return this.repository.update(id, updateData);
    }
    async deleteInvoice(id) {
        // Delete related payments first
        await this.repository.deletePaymentsByInvoiceId(id);
        // Then delete the invoice
        await this.repository.deleteInvoice(id);
    }
}
//# sourceMappingURL=billing.service.js.map