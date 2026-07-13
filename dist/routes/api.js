import { Router } from "express";
import { db } from "../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import { resolveUserPermissions } from "../lib/auth.js";
import path from "path";
export const apiRouter = Router();
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// Counters for sequential ID generation
const idCounters = {
    CUS: 0,
    INV: 0,
    QT: 0,
    EST: 0,
    L: 0,
    JOB: 0,
};
// Helper to generate sequential IDs
const generateSequentialId = async (prefix) => {
    if (idCounters[prefix] === 0) {
        let maxId = 0;
        let model = null;
        if (prefix === "CUS")
            model = db.customer;
        else if (prefix === "INV" || prefix === "QT" || prefix === "EST")
            model = db.invoice;
        else if (prefix === "L")
            model = db.lead;
        else if (prefix === "JOB")
            model = db.job;
        if (model) {
            const allRecords = await model.findMany({
                where: { id: { startsWith: prefix } },
                select: { id: true }
            });
            for (const record of allRecords) {
                const numStr = record.id.replace(prefix, "");
                const num = parseInt(numStr, 10);
                if (!isNaN(num) && num > maxId) {
                    maxId = num;
                }
            }
        }
        idCounters[prefix] = maxId;
    }
    idCounters[prefix] = (idCounters[prefix] || 0) + 1;
    return `${prefix}${String(idCounters[prefix]).padStart(3, "0")}`;
};
// Helper to generate unique IDs (legacy - kept for reference)
const uid = (prefix) => `${prefix}${Date.now().toString(36).toUpperCase()}`;
// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════
// Legacy auth routes removed. Use modular auth routes in src/modules/auth
// ═══════════════════════════════════════════════════════════════
// UPLOADS
// ═══════════════════════════════════════════════════════════════
apiRouter.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        // Return the public URL for the uploaded file
        res.json({ url: `/uploads/${req.file.filename}` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ═══════════════════════════════════════════════════════════════
// DASHBOARD ANALYTICS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/dashboard-legacy", async (req, res) => {
    try {
        const leads = await db.lead.findMany();
        const invoices = await db.invoice.findMany();
        const inventory = await db.inventory.findMany();
        const franchise = await db.franchise.findMany();
        const cars = await db.carIn.findMany();
        const activeLeadsCount = leads.filter(l => l.status === "New" || l.status === "Follow Up").length;
        const carsInWorkshop = cars.filter(c => c.status === "In Workshop");
        // Revenue calculations: paid invoices
        const totalRev = invoices
            .filter(i => i.status === "Paid")
            .reduce((sum, i) => sum + (i.amount + i.gst - i.discount), 0);
        // Pending/Overdue totals
        const pendingAndOverdue = invoices
            .filter(i => i.status === "Pending" || i.status === "Approved" || i.status === "Overdue")
            .reduce((sum, i) => sum + (i.amount + i.gst - i.discount), 0);
        const overdueCount = invoices.filter(i => i.status === "Overdue").length;
        const lowStockItems = inventory.filter(itm => itm.stock <= itm.reorder);
        const stats = {
            revenue: totalRev,
            revenueGrowth: 12, // Dummy growth for visual
            carsInWorkshop: carsInWorkshop.length,
            activeLeads: activeLeadsCount,
            totalLeads: leads.length,
            pendingAmount: pendingAndOverdue,
            overdueCount: overdueCount
        };
        const alerts = [];
        if (lowStockItems.length > 0) {
            alerts.push(`${lowStockItems.length} inventory items are low on stock.`);
        }
        if (overdueCount > 0) {
            alerts.push(`There are ${overdueCount} overdue invoices needing attention.`);
        }
        const carsInFormat = carsInWorkshop.slice(0, 5).map(c => ({
            vehicleNo: c.vehicle,
            model: c.model,
            customer: c.customer,
            inTime: c.inTime
        }));
        const recentLeadsFormat = leads.slice(0, 5).map(l => ({
            name: l.name,
            source: l.source,
            status: l.status,
            color: l.status === "New" ? "yellow" : l.status === "Won" ? "green" : l.status === "Lost" ? "red" : "blue"
        }));
        const sourceCounts = {};
        leads.forEach(l => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });
        const colors = ["blue", "purple", "green", "yellow", "red"];
        const leadSourcesFormat = Object.entries(sourceCounts).map(([name, value], idx) => ({
            name,
            value,
            percent: leads.length ? Math.round((value / leads.length) * 100) : 0,
            color: colors[idx % colors.length]
        }));
        const invCounts = {};
        invoices.forEach(i => {
            const entry = invCounts[i.status] || { count: 0, amt: 0 };
            entry.count++;
            entry.amt += (i.amount + i.gst - i.discount);
            invCounts[i.status] = entry;
        });
        const invoiceStatusFormat = Object.entries(invCounts).map(([status, data]) => ({
            status,
            count: data.count,
            amount: `₹${data.amt.toLocaleString("en-IN")}`
        }));
        const franchiseRevenueFormat = franchise.slice(0, 4).map(f => ({
            location: f.city,
            jobs: `${f.jobs} jobs`,
            revenue: `₹${f.revenue.toLocaleString("en-IN")}`
        }));
        res.json({
            stats,
            alerts,
            carsIn: carsInFormat,
            recentLeads: recentLeadsFormat,
            leadSources: leadSourcesFormat,
            invoiceStatus: invoiceStatusFormat,
            franchiseRevenue: franchiseRevenueFormat
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ═══════════════════════════════════════════════════════════════
// VEHICLE LOOKUP
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/vehicle/:vehicleNo", async (req, res) => {
    try {
        const vehicleNo = String(req.params.vehicleNo || "").toUpperCase();
        // Check Customer first
        const customer = await db.customer.findFirst({ where: { vehicle: vehicleNo } });
        if (customer) {
            res.json({ name: customer.name, phone: customer.phone, email: customer.email, model: customer.model });
            return;
        }
        // Check CarIn
        const carIn = await db.carIn.findFirst({ where: { vehicle: vehicleNo }, orderBy: { inTime: "desc" } });
        if (carIn) {
            res.json({ name: carIn.customer, phone: carIn.phone, model: carIn.model });
            return;
        }
        // Check Lead
        const lead = await db.lead.findFirst({ where: { vehicle: vehicleNo }, orderBy: { date: "desc" } });
        if (lead) {
            res.json({ name: lead.name, phone: lead.phone, email: lead.email, model: "" });
            return;
        }
        res.status(404).json({ error: "Vehicle not found" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ═══════════════════════════════════════════════════════════════
// CAR IN / OUT
// ═══════════════════════════════════════════════════════════════
// Vehicle Check-In routes moved to src/modules/vehicle-checkin/routes/vehicle-checkin.routes.ts
// ═══════════════════════════════════════════════════════════════
// OUT PASS
// ═══════════════════════════════════════════════════════════════
// Outpass routes moved to src/modules/outpass/routes/outpass.routes.ts
// ═══════════════════════════════════════════════════════════════
// LEADS (CRM)
// ═══════════════════════════════════════════════════════════════
// Lead routes moved to src/modules/lead/routes/lead.routes.ts
// ═══════════════════════════════════════════════════════════════
// INVOICES & BILLING
// ═══════════════════════════════════════════════════════════════
// Invoice routes moved to src/modules/billing/routes/billing.routes.ts
// ═══════════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════════
// Payment routes moved to src/modules/payments/routes/payments.routes.ts
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// SERVICES & CATALOG
// ═══════════════════════════════════════════════════════════════
// Service routes moved to src/modules/service/routes/service.routes.ts
// ═══════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════
// Inventory routes moved to src/modules/inventory/routes/inventory.routes.ts
// ═══════════════════════════════════════════════════════════════
// JOB CARDS
// ═══════════════════════════════════════════════════════════════
// Job routes moved to src/modules/job-card/routes/job-card.routes.ts
// Technician Dashboard moved to src/modules/workshop/routes/workshop.routes.ts
// End of jobs
// End of technician dashboard
// ═══════════════════════════════════════════════════════════════
// FRANCHISE
// ═══════════════════════════════════════════════════════════════
// Franchise routes moved to src/modules/franchise/routes/franchise.routes.ts
// ═══════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════
// Customer routes moved to src/modules/customer/routes/customer.routes.ts
// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/settings", async (req, res) => {
    try {
        let settings = await db.setting.findUnique({
            where: { id: "default" },
        });
        if (!settings) {
            settings = await db.setting.create({
                data: {
                    id: "default",
                    companyName: "Shifterz",
                    address: "42, Race Course Rd, Coimbatore – 641018",
                    phone: "0422-123 4567",
                    email: "info@shifterz.in",
                    gstin: "33AAAAA0000A1Z5",
                    gstPct: 18,
                    currency: "₹",
                    agents: ["Arjun", "Sathish", "Mani"],
                    categories: ["PPF", "Ceramic Coating", "Detailing", "General"],
                    securityGuards: [],
                },
            });
        }
        const techs = await db.employee.findMany();
        res.json({
            companyInfo: {
                name: settings.companyName,
                address: settings.address,
                phone: settings.phone,
                email: settings.email,
                gstin: settings.gstin,
                gstPercent: settings.gstPct.toString()
            },
            technicians: techs.map((t) => t.name),
            salesAgents: settings.agents,
            categories: settings.categories,
            securityGuards: settings.securityGuards
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
apiRouter.put("/settings", async (req, res) => {
    try {
        const { companyInfo, technicians, salesAgents, categories, securityGuards } = req.body;
        const settings = await db.setting.upsert({
            where: { id: "default" },
            update: {
                companyName: companyInfo?.name || "Shifterz",
                address: companyInfo?.address || "",
                phone: companyInfo?.phone || "",
                email: companyInfo?.email || "",
                gstin: companyInfo?.gstin || "",
                gstPct: Number(companyInfo?.gstPercent || 18),
                currency: "₹",
                agents: salesAgents || [],
                categories: categories || [],
                securityGuards: securityGuards || [],
            },
            create: {
                id: "default",
                companyName: companyInfo?.name || "Shifterz",
                address: companyInfo?.address || "",
                phone: companyInfo?.phone || "",
                email: companyInfo?.email || "",
                gstin: companyInfo?.gstin || "",
                gstPct: Number(companyInfo?.gstPercent || 18),
                currency: "₹",
                agents: salesAgents || [],
                categories: categories || [],
                securityGuards: securityGuards || [],
            },
        });
        if (Array.isArray(technicians)) {
            // Upsert approach: preserve existing employees (passwords + attendance records).
            // Create new ones, soft-delete removed ones — never hard-delete (avoids FK constraint on Attendance).
            const defaultPassword = await bcrypt.hash("tech123", 10);
            const incomingNames = technicians.filter((t) => typeof t === "string");
            // Restore any previously soft-deleted employees that are back in the list
            await db.employee.updateMany({
                where: { name: { in: incomingNames }, isDeleted: true },
                data: { isDeleted: false, deletedAt: null, status: "Active" },
            });
            // Create employees that don't exist yet
            const existing = await db.employee.findMany({
                where: { name: { in: incomingNames } },
                select: { name: true },
            });
            const existingNames = new Set(existing.map((e) => e.name));
            for (const t of incomingNames) {
                if (!existingNames.has(t)) {
                    const baseUsername = t.replace(/\s+/g, "").toLowerCase();
                    await db.employee.create({
                        data: {
                            id: `TECH_${Math.random().toString(36).substr(2, 9)}`,
                            name: t,
                            phone: "",
                            email: "",
                            status: "Active",
                            username: baseUsername,
                            password: defaultPassword,
                        },
                    });
                }
            }
            // Soft-delete employees that are no longer in the list
            await db.employee.updateMany({
                where: { name: { notIn: incomingNames }, isDeleted: false },
                data: { isDeleted: true, deletedAt: new Date().toISOString() },
            });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ═══════════════════════════════════════════════════════════════
// TECHNICIANS
// ═══════════════════════════════════════════════════════════════
// Technician routes moved to src/modules/employee/routes/employee.routes.ts
// ═══════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════
// Employee routes moved to src/modules/employee/routes/employee.routes.ts
// ═══════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════
// Attendance routes moved to src/modules/employee/routes/attendance.routes.ts
// ═══════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/reports", async (req, res) => {
    try {
        const invoices = await db.invoice.findMany();
        const payments = await db.payment.findMany();
        const leads = await db.lead.findMany();
        const jobs = await db.job.findMany();
        const inventory = await db.inventory.findMany();
        const franchises = await db.franchise.findMany();
        // Total Invoiced & Collected
        const totalInvoiced = invoices.reduce((sum, i) => sum + (i.amount + i.gst - i.discount), 0);
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
        // Billing Data (Invoice Aging / Status)
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
        res.json({
            billingData,
            serviceRevenue,
            leadSources,
            jobSummary,
            inventoryValue,
            totalInvoiced,
            totalCollected,
            leadConversion,
            franchiseRevenue,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ═══════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════
// Attendance routes moved to src/modules/employee/routes/attendance.routes.ts
// File Upload Endpoint
apiRouter.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=api.js.map