import { LeadRepository } from '../repository/lead.repository.js';
import { generateSequentialId } from '../../../shared/utils/idGenerator.js';
export class LeadService {
    repository;
    constructor() {
        this.repository = new LeadRepository();
    }
    async getLeads(tenantFilter) {
        return this.repository.findAll(tenantFilter);
    }
    async createLead(data, franchiseId) {
        const leadId = await generateSequentialId("L");
        const newLead = await this.repository.create({
            id: leadId,
            name: data.name,
            phone: data.phone || "",
            email: data.email || "",
            source: data.source || "JustDial",
            service: data.service || "",
            vehicle: data.vehicle || "",
            assignedTo: data.assignedTo || "",
            status: data.status || "New",
            notes: data.notes || "",
            budget: String(data.budget || "0"),
            date: data.date || new Date().toISOString().slice(0, 10),
            franchiseId: franchiseId,
        });
        if (newLead.status === "Converted" && newLead.phone) {
            await this.handleConvertedLeadCustomer(newLead, franchiseId);
        }
        return newLead;
    }
    async updateLead(id, data) {
        const updatedLead = await this.repository.update(id, {
            name: data.name,
            phone: data.phone,
            email: data.email,
            source: data.source,
            service: data.service,
            vehicle: data.vehicle,
            assignedTo: data.assignedTo,
            status: data.status,
            notes: data.notes,
            budget: String(data.budget || "0"),
            date: data.date,
        });
        if (updatedLead.status === "Converted" && updatedLead.phone) {
            await this.handleConvertedLeadCustomer(updatedLead, updatedLead.franchiseId);
        }
        else if (updatedLead.phone) {
            const existingCust = await this.repository.findCustomerByPhone(updatedLead.phone);
            if (existingCust && existingCust.visits === 0) {
                await this.repository.deleteCustomer(existingCust.id);
            }
        }
        return updatedLead;
    }
    async deleteLead(id) {
        return this.repository.softDelete(id);
    }
    async handleConvertedLeadCustomer(lead, franchiseId) {
        const existingCust = await this.repository.findCustomerByPhone(lead.phone);
        if (!existingCust) {
            const customerId = await generateSequentialId("CUS");
            await this.repository.createCustomer({
                id: customerId,
                name: lead.name,
                phone: lead.phone,
                email: lead.email,
                vehicle: lead.vehicle,
                model: "",
                visits: 0,
                totalSpend: 0,
                lastVisit: new Date().toISOString().slice(0, 10),
                franchiseId: franchiseId,
            });
        }
    }
}
//# sourceMappingURL=lead.service.js.map