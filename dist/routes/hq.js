import { Router } from "express";
import { db } from "../lib/db.js";
import { requireAuth, requireRole } from "../lib/auth.js";
import bcrypt from "bcrypt";
export const hqRouter = Router();
// Secure all routes in this router to SUPER_ADMIN or HQ_USER
hqRouter.use(requireAuth);
hqRouter.use(requireRole(["SUPER_ADMIN", "HQ_USER"]));
// ═══════════════════════════════════════════════════════════════
// FRANCHISE MANAGEMENT (HQ Only)
// ═══════════════════════════════════════════════════════════════
// Create a new franchise
hqRouter.post("/franchises", async (req, res) => {
    try {
        const { name, city, owner, phone, since, royaltyPct, status, adminUsername, adminPassword, businessName, gstNumber, email, address, state, pinCode, licenseStatus } = req.body;
        if (adminUsername) {
            const existing = await db.employee.findFirst({
                where: { username: adminUsername }
            });
            if (existing) {
                res.status(400).json({ error: "Username is already taken by another employee/admin" });
                return;
            }
        }
        // Generate a unique ID (e.g. FRA001)
        const count = await db.franchise.count();
        const id = `FRA${String(count + 1).padStart(3, "0")}`;
        const newFranchise = await db.$transaction(async (tx) => {
            const franchise = await tx.franchise.create({
                data: {
                    id,
                    name,
                    city,
                    owner,
                    phone,
                    since: since || new Date().toISOString().split('T')[0],
                    revenue: 0,
                    jobs: 0,
                    royaltyPct: Number(royaltyPct) || 10.0,
                    status: status || "Active",
                    businessName,
                    gstNumber,
                    email,
                    address,
                    state,
                    pinCode,
                    licenseStatus: licenseStatus || "Active"
                }
            });
            if (adminUsername && adminPassword) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                const userId = `USR${Date.now().toString(36).toUpperCase()}`;
                await tx.employee.create({
                    data: {
                        id: userId,
                        name: adminUsername,
                        username: adminUsername,
                        password: hashedPassword,
                        role: "FRANCHISE_ADMIN",
                        franchiseId: id
                    }
                });
            }
            return franchise;
        });
        res.json(newFranchise);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// List all franchises
hqRouter.get("/franchises", async (req, res) => {
    try {
        const franchises = await db.franchise.findMany({
            where: { isDeleted: false }
        });
        res.json(franchises);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete a franchise
hqRouter.delete("/franchises/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.franchise.delete({
            where: { id }
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ═══════════════════════════════════════════════════════════════
// GLOBAL USER MANAGEMENT (HQ Only)
// ═══════════════════════════════════════════════════════════════
// Create a Franchise Admin for a specific franchise
hqRouter.post("/users", async (req, res) => {
    try {
        const { username, password, role, franchiseId } = req.body;
        if (!username || !password || !role) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = `USR${Date.now().toString(36).toUpperCase()}`;
        const newUser = await db.employee.create({
            data: {
                id: userId,
                username,
                name: username, // Employee requires name
                password: hashedPassword,
                role,
                franchiseId: franchiseId || null,
            }
        });
        // Exclude password from response
        const { password: _, ...userWithoutPassword } = newUser;
        res.json(userWithoutPassword);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get HQ global dashboard stats
hqRouter.get("/dashboard", async (req, res) => {
    try {
        const totalFranchises = await db.franchise.count();
        const invoices = await db.invoice.findMany({ where: { status: "Paid" } });
        const globalRevenue = invoices.reduce((sum, i) => sum + (i.amount + i.gst - i.discount), 0);
        const totalJobs = await db.job.count();
        const franchises = await db.franchise.findMany();
        const franchiseRevenue = franchises.map(f => ({
            location: f.city,
            jobs: `${f.jobs} jobs`,
            revenue: `₹${f.revenue.toLocaleString("en-IN")}`
        }));
        const inventory = await db.inventory.findMany();
        const globalLowStock = inventory.filter(item => item.stock <= item.reorder).length;
        res.json({
            totalFranchises,
            globalRevenue,
            totalJobs,
            franchiseRevenue,
            globalLowStock
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=hq.js.map