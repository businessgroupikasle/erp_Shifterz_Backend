import { db } from '../../../lib/db.js';
import type { CreatePaymentDTO } from '../validation/payments.validation.js';

export class PaymentsRepository {
  async findAll() {
    return db.payment.findMany({ orderBy: { date: "desc" } });
  }

  async findInvoiceById(id: string) {
    return db.invoice.findUnique({ where: { id } });
  }

  async create(id: string, data: CreatePaymentDTO, clientName: string) {
    return db.payment.create({
      data: {
        id,
        invoiceId: data.invoiceId,
        client: clientName,
        amount: Number(data.amount || 0),
        mode: data.mode || "UPI",
        date: data.date || new Date().toISOString().slice(0, 10),
        ref: data.ref || "",
        notes: data.notes || "",
        createdBy: data.createdBy || null,
      },
    });
  }

  async findPaymentsByInvoiceId(invoiceId: string) {
    return db.payment.findMany({ where: { invoiceId } });
  }

  async updateInvoiceStatus(id: string, status: string) {
    return db.invoice.update({
      where: { id },
      data: { status },
    });
  }

  async findCustomerByPhone(phone: string) {
    return db.customer.findFirst({ where: { phone } });
  }

  async incrementCustomerSpend(id: string, amountToAdd: number) {
    const cust = await db.customer.findUnique({ where: { id } });
    if (!cust) return null;
    return db.customer.update({
      where: { id },
      data: { totalSpend: cust.totalSpend + amountToAdd },
    });
  }

  async softDelete(id: string) {
    return db.payment.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date().toISOString() },
    });
  }
}
