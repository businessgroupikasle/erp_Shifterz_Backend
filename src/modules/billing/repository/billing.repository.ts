import { db } from '../../../lib/db.js';
import type { CreateInvoiceDTO, UpdateInvoiceDTO } from '../validation/billing.validation.js';

export class BillingRepository {
  async findAll() {
    return db.invoice.findMany({ orderBy: { date: "desc" } });
  }

  async findAllPayments() {
    return db.payment.findMany();
  }

  async findMaxIdForPrefix(prefix: string) {
    const allRecords = await db.invoice.findMany({
      where: { id: { startsWith: prefix } },
      select: { id: true }
    });

    let maxId = 0;
    for (const record of allRecords) {
      const numStr = record.id.replace(prefix, "");
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
    return maxId;
  }

  async create(id: string, data: CreateInvoiceDTO) {
    return db.invoice.create({
      data: {
        id,
        type: data.type,
        client: data.client,
        phone: data.phone || "",
        vehicle: data.vehicle || "",
        service: data.service || "",
        amount: Number(data.amount || 0),
        gst: Number(data.gst || 0),
        discount: Number(data.discount || 0),
        status: data.status || "Pending",
        date: data.date || new Date().toISOString().slice(0, 10),
        dueDate: data.dueDate || new Date().toISOString().slice(0, 10),
        notes: data.notes || "",
        gstNumber: data.gstNumber || null,
        items: data.items ? data.items : null,
        bankDetails: data.bankDetails || null,
        paymentTerms: data.paymentTerms || null,
        deliveryTerms: data.deliveryTerms || null,
        authorizedSignatory: data.authorizedSignatory || null,
        createdBy: data.createdBy || null,
        approvedBy: data.status === "Approved" ? data.createdBy : null,
      },
    });
  }

  async findById(id: string) {
    return db.invoice.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return db.invoice.update({
      where: { id },
      data,
    });
  }

  async deletePaymentsByInvoiceId(invoiceId: string) {
    return db.payment.deleteMany({ where: { invoiceId } });
  }

  async deleteInvoice(id: string) {
    return db.invoice.deleteMany({ where: { id } });
  }
}
