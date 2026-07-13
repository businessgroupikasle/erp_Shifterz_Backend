import { db } from '../../../lib/db.js';

export class ReportRepository {
  async getInvoices() { return db.invoice.findMany(); }
  async getPayments() { return db.payment.findMany(); }
  async getLeads() { return db.lead.findMany(); }
  async getJobs() { return db.job.findMany(); }
  async getInventory() { return db.inventory.findMany(); }
  async getFranchises() { return db.franchise.findMany(); }
}
