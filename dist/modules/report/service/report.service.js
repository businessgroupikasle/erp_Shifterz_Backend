import { ReportRepository } from '../repository/report.repository.js';
export class ReportService {
    repository;
    constructor(repository = new ReportRepository()) {
        this.repository = repository;
    }
    async getReports() {
        const [invoices, payments, leads, jobs, inventory, franchises] = await Promise.all([
            this.repository.getInvoices(),
            this.repository.getPayments(),
            this.repository.getLeads(),
            this.repository.getJobs(),
            this.repository.getInventory(),
            this.repository.getFranchises()
        ]);
        // Total Invoiced & Collected
        const totalInvoiced = invoices.reduce((sum, i) => sum + (i.amount + i.gst - i.discount), 0);
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
        // Billing Data
        const statusMap = {};
        invoices.forEach(i => {
            const entry = statusMap[i.status] || { amount: 0, count: 0 };
            entry.amount += (i.amount + i.gst - i.discount);
            entry.count += 1;
            statusMap[i.status] = entry;
        });
        const billingData = Object.entries(statusMap).map(([status, data]) => ({
            status,
            amount: data.amount,
            count: data.count,
        }));
        // Service Revenue
        const serviceMap = {};
        let totalServiceRevenue = 0;
        invoices.forEach(i => {
            const s = i.service || "General";
            if (!serviceMap[s])
                serviceMap[s] = 0;
            const val = (i.amount + i.gst - i.discount);
            serviceMap[s] += val;
            totalServiceRevenue += val;
        });
        const serviceRevenue = Object.entries(serviceMap).map(([service, amount]) => ({
            service,
            amount,
            percentage: totalServiceRevenue > 0 ? Math.round((amount / totalServiceRevenue) * 100) : 0,
        })).sort((a, b) => b.amount - a.amount);
        // Lead Sources
        const sourceMap = {};
        leads.forEach(l => {
            const s = l.source || "Other";
            sourceMap[s] = (sourceMap[s] || 0) + 1;
        });
        const totalLeads = leads.length;
        const leadSources = Object.entries(sourceMap).map(([source, count]) => ({
            source,
            count,
            percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
        })).sort((a, b) => b.count - a.count);
        // Lead Conversion
        const convertedLeads = leads.filter(l => l.status === "Converted" || l.status === "Won" || l.status === "Closed").length;
        const leadConversion = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
        // Job Summary
        const jobStatusMap = {};
        jobs.forEach(j => {
            jobStatusMap[j.status] = (jobStatusMap[j.status] || 0) + 1;
        });
        const jobSummary = Object.entries(jobStatusMap).map(([status, count]) => {
            let color = "bg-gray-100 text-gray-700";
            if (status === "Completed")
                color = "bg-green-100 text-green-700";
            if (status === "Pending")
                color = "bg-yellow-100 text-yellow-700";
            if (status === "In Progress")
                color = "bg-blue-100 text-blue-700";
            if (status === "Cancelled")
                color = "bg-red-100 text-red-700";
            return { status, count, color };
        });
        // Inventory Value
        const inventoryMap = {};
        inventory.forEach(i => {
            const c = i.category || "General";
            if (!inventoryMap[c])
                inventoryMap[c] = { value: 0, items: 0 };
            inventoryMap[c].value += (i.stock * i.cost);
            inventoryMap[c].items += i.stock;
        });
        const inventoryValue = Object.entries(inventoryMap).map(([category, data]) => ({
            category,
            value: data.value,
            items: data.items,
        }));
        // Franchise Revenue
        const franchiseRevenue = franchises.reduce((sum, f) => sum + f.revenue, 0);
        return {
            billingData,
            serviceRevenue,
            leadSources,
            jobSummary,
            inventoryValue,
            totalInvoiced,
            totalCollected,
            leadConversion,
            franchiseRevenue,
        };
    }
}
//# sourceMappingURL=report.service.js.map