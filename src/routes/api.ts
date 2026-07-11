import { Router, type Request, type Response } from "express";
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
const idCounters: Record<string, number> = {
  CUS: 0,
  INV: 0,
  QT: 0,
  EST: 0,
  L: 0,
  JOB: 0,
};

// Helper to generate sequential IDs
const generateSequentialId = async (prefix: string): Promise<string> => {
  if (idCounters[prefix] === 0) {
    let maxId = 0;
    let model: any = null;
    if (prefix === "CUS") model = db.customer;
    else if (prefix === "INV" || prefix === "QT" || prefix === "EST") model = db.invoice;
    else if (prefix === "L") model = db.lead;
    else if (prefix === "JOB") model = db.job;

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
const uid = (prefix: string) => `${prefix}${Date.now().toString(36).toUpperCase()}`;

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════
apiRouter.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const normalizedUsername = String(username).trim().toLowerCase();

    let user = await db.employee.findUnique({
      where: { username: normalizedUsername },
      include: { permission: true }
    });

    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const baseRole = user.role.split("|")[0];

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
      franchiseId: user.franchiseId,
      ...(baseRole === "TECHNICIAN" || baseRole === "QUALITY_INSPECTOR" ? { technicianId: user.id } : {})
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "shifterz_secret_key",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: tokenPayload,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;

    const userData = await db.employee.findUnique({
      where: { id: decoded.id },
      include: { permission: true }
    });
    if (!userData) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const baseRole = userData.role.split("|")[0];
    const resolvedPermissions = await resolveUserPermissions(userData.id, userData.role);
    res.json({
      user: {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        permissions: resolvedPermissions,
        franchiseId: userData.franchiseId,
        ...(baseRole === "TECHNICIAN" || baseRole === "QUALITY_INSPECTOR" ? { technicianId: userData.id } : {})
      },
    });
  } catch (error: any) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

apiRouter.get("/auth/roles/permissions", async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await db.rolePermission.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/auth/roles/permissions/:role", async (req: Request, res: Response): Promise<void> => {
  try {
    const role = req.params.role as string;
    const permissions = req.body.permissions as string[];
    if (!Array.isArray(permissions)) {
      res.status(400).json({ error: "permissions must be an array of strings" });
      return;
    }
    const updated = await db.rolePermission.upsert({
      where: { role },
      update: { permissions },
      create: { role, permissions },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});




// ═══════════════════════════════════════════════════════════════
// UPLOADS
// ═══════════════════════════════════════════════════════════════
apiRouter.post("/upload", upload.single("file"), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    // Return the public URL for the uploaded file
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// DASHBOARD ANALYTICS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/dashboard-legacy", async (req: Request, res: Response): Promise<void> => {
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

    const sourceCounts: Record<string, number> = {};
    leads.forEach(l => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });
    const colors = ["blue", "purple", "green", "yellow", "red"];
    const leadSourcesFormat = Object.entries(sourceCounts).map(([name, value], idx) => ({
      name,
      value,
      percent: leads.length ? Math.round((value / leads.length) * 100) : 0,
      color: colors[idx % colors.length]
    }));

    const invCounts: Record<string, { count: number, amt: number }> = {};
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// VEHICLE LOOKUP
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/vehicle/:vehicleNo", async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// CAR IN / OUT
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/carin", async (req: Request, res: Response) => {
  try {
    const list = await db.carIn.findMany({ orderBy: { inTime: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/carin", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let franchiseId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        franchiseId = decoded.franchiseId || null;
      } catch (e) { }
    }

    const carId = uid("CAR");
    const jobCardId = await generateSequentialId("JOB");

    const newCar = await db.carIn.create({
      data: {
        id: carId,
        vehicle: data.vehicle,
        model: data.model || "",
        customer: data.customer || "",
        phone: data.phone || "",
        service: data.service || "",
        technicianIn: data.technicianIn || "",
        inTime: data.inTime || new Date().toISOString(),
        outTime: null,
        status: "In Workshop",
        odometer: String(data.odometer || "0"),
        notes: data.notes || "",
        jobCardId,
        franchiseId,
      },
    });

    // Automatically create a corresponding Job Card
    await db.job.create({
      data: {
        id: jobCardId,
        vehicle: data.vehicle,
        customer: data.customer || "",
        service: data.service || "",
        technician: data.technicianIn || "",
        status: "Pending",
        priority: "Normal",
        startDate: (data.inTime || new Date().toISOString()).slice(0, 10),
        estCompletion: (data.inTime || new Date().toISOString()).slice(0, 10),
        actualCompletion: null,
        notes: "Auto-created from check-in",
        franchiseId,
      },
    });

    // Upsert customer register
    const existingCust = await db.customer.findFirst({
      where: { phone: data.phone },
    });
    if (existingCust) {
      await db.customer.update({
        where: { id: existingCust.id },
        data: {
          visits: existingCust.visits + 1,
          lastVisit: new Date().toISOString().slice(0, 10),
        },
      });
    } else {
      await db.customer.create({
        data: {
          id: await generateSequentialId("CUS"),
          name: data.customer || "Walk-in",
          phone: data.phone || "",
          email: "",
          vehicle: data.vehicle,
          model: data.model || "",
          visits: 1,
          totalSpend: 0,
          lastVisit: new Date().toISOString().slice(0, 10),
          franchiseId,
        },
      });
    }

    res.json(newCar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a car entry
apiRouter.put("/carin/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.carIn.update({
      where: { id },
      data: {
        vehicle: data.vehicle,
        model: data.model,
        customer: data.customer,
        phone: data.phone,
        service: data.service,
        technicianIn: data.technicianIn,
        odometer: String(data.odometer || "0"),
        notes: data.notes,
      },
    });

    if (updated.jobCardId) {
      await db.job.update({
        where: { id: updated.jobCardId },
        data: {
          vehicle: data.vehicle,
          customer: data.customer,
          service: data.service,
          technician: data.technicianIn,
        },
      });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check-out a car and generate out pass
apiRouter.put("/carin/:id/checkout", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { securityName } = req.body;
    const now = new Date().toISOString();

    const car = await db.carIn.findUnique({ where: { id } });
    if (!car) {
      res.status(404).json({ error: "Car entry not found" });
      return;
    }

    const updatedCar = await db.carIn.update({
      where: { id },
      data: {
        outTime: now,
        status: "Delivered",
      },
    });

    // Auto update completed status on Job Card
    if (car.jobCardId) {
      await db.job.update({
        where: { id: car.jobCardId },
        data: {
          status: "Completed",
          actualCompletion: now.slice(0, 10),
        },
      });
    }

    // Auto-create exit OutPass if it doesn't exist
    const existPass = await db.outPass.findFirst({
      where: { carInId: id },
    });
    if (!existPass) {
      await db.outPass.create({
        data: {
          id: uid("OP"),
          vehicle: car.vehicle,
          model: car.model,
          customer: car.customer,
          phone: car.phone,
          service: car.service,
          outTime: now,
          securityName: securityName || "N/A",
          technicianName: car.technicianIn,
          remarks: "Washed and checked out successfully.",
          issued: true,
          carInId: id,
        },
      });
    }

    res.json(updatedCar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a car entry
apiRouter.delete("/carin/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    // Delete any associated OutPass first due to logical relation (though no strict database constraint, it keeps data clean)
    await db.outPass.deleteMany({ where: { carInId: id } });

    await db.carIn.delete({
      where: { id },
    });

    res.json({ success: true, message: "Car entry deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// ═══════════════════════════════════════════════════════════════
// OUT PASS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/outpass", async (req: Request, res: Response) => {
  try {
    const list = await db.outPass.findMany({ orderBy: { outTime: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/outpass", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newPass = await db.outPass.create({
      data: {
        id: uid("OP"),
        vehicle: data.vehicle,
        model: data.model || "",
        customer: data.customer || "",
        phone: data.phone || "",
        service: data.service || "",
        outTime: data.outTime || new Date().toISOString(),
        securityName: data.securityName || "",
        technicianName: data.technicianName || "",
        remarks: data.remarks || "",
        issued: true,
        carInId: data.carInId || "",
      },
    });
    res.json(newPass);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/outpass/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPass = await db.outPass.update({
      where: { id: id as string },
      data: {
        vehicle: data.vehicle,
        model: data.model,
        customer: data.customer,
        phone: data.phone,
        service: data.service,
        outTime: data.outTime,
        securityName: data.securityName,
        technicianName: data.technicianName,
        remarks: data.remarks,
      },
    });
    res.json(updatedPass);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// LEADS (CRM)
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/leads", async (req: Request, res: Response) => {
  try {
    let tenantFilter = {};
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER" && decoded.franchiseId) {
          tenantFilter = { franchiseId: decoded.franchiseId };
        }
      } catch (e) { }
    }
    const list = await db.lead.findMany({ where: tenantFilter, orderBy: { date: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/leads", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let franchiseId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        franchiseId = decoded.franchiseId || null;
      } catch (e) { }
    }

    const newLead = await db.lead.create({
      data: {
        id: await generateSequentialId("L"),
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
      },
    });

    if (newLead.status === "Converted" && newLead.phone) {
      const existingCust = await db.customer.findFirst({ where: { phone: newLead.phone } });
      if (!existingCust) {
        await db.customer.create({
          data: {
            id: await generateSequentialId("CUS"),
            name: newLead.name,
            phone: newLead.phone,
            email: newLead.email,
            vehicle: newLead.vehicle,
            model: "",
            visits: 0,
            totalSpend: 0,
            lastVisit: new Date().toISOString().slice(0, 10),
            franchiseId: franchiseId,
          }
        });
      }
    }

    res.json(newLead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/leads/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.lead.update({
      where: { id },
      data: {
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
      },
    });

    if (updated.status === "Converted" && updated.phone) {
      const existingCust = await db.customer.findFirst({ where: { phone: updated.phone } });
      if (!existingCust) {
        await db.customer.create({
          data: {
            id: await generateSequentialId("CUS"),
            name: updated.name,
            phone: updated.phone,
            email: updated.email,
            vehicle: updated.vehicle,
            model: "",
            visits: 0,
            totalSpend: 0,
            lastVisit: new Date().toISOString().slice(0, 10),
            franchiseId: updated.franchiseId,
          }
        });
      }
    } else if (updated.phone) {
      // If status is changed from Converted to something else, remove customer if they have 0 visits
      const existingCust = await db.customer.findFirst({ where: { phone: updated.phone } });
      if (existingCust && existingCust.visits === 0) {
        await db.customer.delete({ where: { id: existingCust.id } });
      }
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/leads/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.lead.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true, message: "Lead deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// INVOICES & BILLING
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/invoices", async (req: Request, res: Response) => {
  try {
    const list = await db.invoice.findMany({ orderBy: { date: "desc" } });

    const payments = await db.payment.findMany();

    const listWithPaidAmount = list.map(inv => {
      const invPayments = payments.filter(p => p.invoiceId === inv.id);
      const paidAmount = invPayments.reduce((sum, p) => sum + p.amount, 0);
      return { ...inv, paidAmount };
    });

    res.json(listWithPaidAmount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/invoices", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
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
    }[data.type as string] || `STZ-DOC-${fy}-`;

    const allRecords = await db.invoice.findMany({
      where: { id: { startsWith: docTypePrefix } },
      select: { id: true }
    });
    let maxId = 0;
    for (const record of allRecords) {
      const numStr = record.id.replace(docTypePrefix, "");
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
    const invId = `${docTypePrefix}${maxId + 1}`;

    const newInv = await db.invoice.create({
      data: {
        id: invId,
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
      },
    });
    res.json(newInv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/invoices/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.invoice.update({
      where: { id },
      data: {
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
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/invoices/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    // Delete related payments first (cascade delete)
    await db.payment.deleteMany({ where: { invoiceId: id } });

    // Then delete the invoice
    await db.invoice.deleteMany({ where: { id } });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/payments", async (req: Request, res: Response) => {
  try {
    const list = await db.payment.findMany({ orderBy: { date: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/payments", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    // Find invoice
    const invoice = await db.invoice.findUnique({
      where: { id: data.invoiceId },
    });
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const payId = uid("PAY");
    const newPayment = await db.payment.create({
      data: {
        id: payId,
        invoiceId: data.invoiceId,
        client: invoice.client,
        amount: Number(data.amount || 0),
        mode: data.mode || "UPI",
        date: data.date || new Date().toISOString().slice(0, 10),
        ref: data.ref || "",
        notes: data.notes || "",
      },
    });

    // Check total payments for this invoice
    const allPays = await db.payment.findMany({
      where: { invoiceId: data.invoiceId },
    });
    const totalPaid = allPays.reduce((sum, p) => sum + p.amount, 0);
    const invoiceTotal = invoice.amount + invoice.gst - invoice.discount;

    if (totalPaid >= invoiceTotal) {
      await db.invoice.update({
        where: { id: data.invoiceId },
        data: { status: "Paid" },
      });
    }

    // Update customer spend and visits
    const cust = await db.customer.findFirst({
      where: { phone: invoice.phone },
    });
    if (cust) {
      await db.customer.update({
        where: { id: cust.id },
        data: {
          totalSpend: cust.totalSpend + Number(data.amount || 0),
        },
      });
    }

    res.json(newPayment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/payments/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.payment.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true, message: "Payment deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// SERVICES & CATALOG
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/services", async (req: Request, res: Response) => {
  try {
    const list = await db.service.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/services", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const svcId = uid("SVC");
    const newSvc = await db.service.create({
      data: {
        id: svcId,
        name: data.name,
        category: data.category || "General",
        price: Number(data.price || 0),
        duration: data.duration || "1 day",
        warranty: data.warranty || "—",
        desc: data.desc || "",
      },
    });
    res.json(newSvc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/services/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.service.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        price: Number(data.price || 0),
        duration: data.duration,
        warranty: data.warranty,
        desc: data.desc,
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/services/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.service.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/inventory", async (req: Request, res: Response) => {
  try {
    const list = await db.inventory.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/inventory", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const itmId = uid("ITM");
    const newItm = await db.inventory.create({
      data: {
        id: itmId,
        name: data.name,
        unit: data.unit || "Piece",
        category: data.category || "Consumable",
        stock: Number(data.stock || 0),
        reorder: Number(data.reorder || 0),
        cost: Number(data.cost || 0),
        supplier: data.supplier || "",
        location: data.location || "",
      },
    });
    res.json(newItm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/inventory/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.inventory.update({
      where: { id },
      data: {
        name: data.name,
        unit: data.unit,
        category: data.category,
        stock: Number(data.stock || 0),
        reorder: Number(data.reorder || 0),
        cost: Number(data.cost || 0),
        supplier: data.supplier,
        location: data.location,
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/inventory/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.inventory.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// JOB CARDS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/jobs", async (req: Request, res: Response): Promise<void> => {
  try {
    let filter = {};
    const authHeader = req.headers.authorization;
    let userInfo = { role: "admin", technicianId: null };

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
          userInfo = { role: decoded.role, technicianId: decoded.technicianId };

          if (decoded.role?.toUpperCase() === "TECHNICIAN" && decoded.technicianId) {
            filter = { technicianId: decoded.technicianId };
          }
        } catch (e) {
          // ignore invalid token for filtering purposes
        }
      }
    }

    const list = await db.job.findMany({
      where: filter,
      orderBy: { createdAt: "desc" }
    });

    // Debug info
    console.log(`[Jobs API] User Role: ${userInfo.role}, TechnicianId: ${userInfo.technicianId}, Filter: ${JSON.stringify(filter)}, Results: ${list.length}`);

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/technician/dashboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;

    // For now we assume decoded has id and role
    const employeeId = decoded.id;

    // 1. Get today's attendance
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const attendance = await db.attendance.findFirst({
      where: {
        employeeId,
        date: todayStr,
        isDeleted: false
      }
    });

    // 2. Get jobs for this technician
    const jobs = await db.job.findMany({
      where: {
        technicianId: employeeId,
        isDeleted: false
      }
    });

    // Compute summaries
    const totalAssigned = jobs.length;
    const inProgress = jobs.filter((j: any) => j.status === "In Progress").length;
    const waitingMaterial = jobs.filter((j: any) => j.status === "Waiting Material").length;
    const waitingCustomer = jobs.filter((j: any) => j.status === "Waiting Customer").length;
    const waitingQC = jobs.filter((j: any) => j.status === "Waiting QC").length;
    const completed = jobs.filter((j: any) => j.status === "Completed").length;

    // Completed today
    const completedToday = jobs.filter((j: any) =>
      j.status === "Completed" &&
      j.actualCompletion &&
      j.actualCompletion.startsWith(todayStr)
    ).length;

    // Return aggregated data
    res.json({
      attendance: attendance || { status: "Not Checked In", clockIn: null, clockOut: null },
      jobsSummary: {
        totalAssigned,
        inProgress,
        waitingMaterial,
        waitingCustomer,
        waitingQC,
        completedToday,
        totalCompleted: completed
      },
      // Mock performance metrics as recommended in the plan
      performance: {
        jobsCompleted: completed,
        avgCompletionTime: "4.5 hrs",
        qcPassRate: "92%",
        reworkCount: 2
      },
      // Mock notifications
      notifications: [
        { id: 1, type: "info", text: "New job assigned: TN 04 AB 1234 (PPF Full Body)", time: "10m ago" },
        { id: 2, type: "warning", text: "Priority changed to URGENT for KL 01 CD 5678", time: "1h ago" },
        { id: 3, type: "error", text: "QC Failed for TN 99 AA 9999 (Wash)", time: "2h ago" },
        { id: 4, type: "success", text: "System maintenance completed successfully.", time: "1d ago" }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/jobs", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const jobId = await generateSequentialId("JOB");

    // Lookup technicianId if not provided
    let techId = data.technicianId || null;
    if (!techId && data.technician) {
      const techRecord = await db.employee.findFirst({ where: { name: data.technician } });
      if (techRecord) techId = techRecord.id;
    }

    const newJob = await db.job.create({
      data: {
        id: jobId,
        vehicle: data.vehicle,
        customer: data.customer || "",
        service: data.service || "",
        technician: data.technician || "",
        technicianId: techId,
        status: data.status || "Pending",
        priority: data.priority || "Normal",
        startDate: data.startDate || new Date().toISOString().slice(0, 10),
        estCompletion: data.estCompletion || new Date().toISOString().slice(0, 10),
        actualCompletion: null,
        notes: data.notes || "",
        photos: data.photos || [],
      },
    });
    res.json(newJob);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.job.update({
      where: { id },
      data: {
        technician: data.technician,
        technicianId: data.technicianId,
        status: data.status,
        priority: data.priority,
        estCompletion: data.estCompletion,
        actualCompletion: data.actualCompletion || null,
        notes: data.notes,
        photos: data.photos,
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.job.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true, message: "Job deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/services", async (req: Request, res: Response) => {
  try {
    const list = await db.service.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// FRANCHISE
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/franchise", async (req: Request, res: Response) => {
  try {
    const list = await db.franchise.findMany({ orderBy: { revenue: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/franchise", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const franId = uid("F");
    const newFran = await db.franchise.create({
      data: {
        id: franId,
        name: data.name,
        city: data.city,
        owner: data.owner || "",
        phone: data.phone || "",
        since: data.since || new Date().toISOString().slice(0, 10),
        revenue: Number(data.revenue || 0),
        jobs: Number(data.jobs || 0),
        royaltyPct: Number(data.royaltyPct || 5),
        status: data.status || "Active",
      },
    });
    res.json(newFran);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/franchise/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await db.franchise.update({
      where: { id },
      data: {
        name: data.name,
        city: data.city,
        owner: data.owner,
        phone: data.phone,
        since: data.since,
        revenue: Number(data.revenue || 0),
        jobs: Number(data.jobs || 0),
        royaltyPct: Number(data.royaltyPct || 5),
        status: data.status,
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/franchise/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.franchise.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true, message: "Franchise deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/customers", async (req: Request, res: Response) => {
  try {
    let tenantFilter = {};
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER" && decoded.franchiseId) {
          tenantFilter = { franchiseId: decoded.franchiseId };
        }
      } catch (e) { }
    }

    const list = await db.customer.findMany({
      where: {
        ...tenantFilter,
        isDeleted: false,
      },
      orderBy: { totalSpend: "desc" },
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/customers", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let franchiseId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        franchiseId = decoded.franchiseId || null;
      } catch (e) { }
    }

    const custId = uid("CUST");
    const newCust = await db.customer.create({
      data: {
        id: custId,
        name: data.name,
        phone: data.phone || "",
        email: data.email || "",
        vehicle: data.vehicle || "",
        model: data.model || "",
        visits: 0,
        totalSpend: 0,
        lastVisit: new Date().toISOString().slice(0, 10),
        franchiseId: franchiseId,
      },
    });
    res.json(newCust);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/customers/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.customer.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true, message: "Customer deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/settings", async (req: Request, res: Response) => {
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
      technicians: techs.map((t: any) => t.name),
      salesAgents: settings.agents,
      categories: settings.categories,
      securityGuards: settings.securityGuards
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/settings", async (req: Request, res: Response) => {
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
      const incomingNames: string[] = technicians.filter((t: any) => typeof t === "string");

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
      const existingNames = new Set(existing.map((e: any) => e.name));

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// TECHNICIANS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/technicians", async (req: Request, res: Response) => {
  try {
    const list = await db.employee.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/technicians", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const techId = uid("TECH");

    // Enforce 6 franchise users limit
    const authHeader = req.headers.authorization;
    let franchiseId = null;
    let role = "TECHNICIAN";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        franchiseId = decoded.franchiseId || null;
        if (decoded.role === "SUPER_ADMIN" || decoded.role === "HQ_USER") {
          // If created by HQ, maybe it's not bound by strict limits or they can set franchise
          franchiseId = data.franchiseId || null;
        }
      } catch (e) { }
    }

    if (franchiseId) {
      const userCount = await db.employee.count({ where: { franchiseId } });
      // Count excludes FRANCHISE_ADMIN if we strictly say "6 franchise users in addition to Admin", 
      // but let's just limit total employees per franchise to 6 for now.
      if (userCount >= 6) {
        res.status(403).json({ error: "License limit reached. Maximum 6 users allowed per franchise." });
        return;
      }
    }


    // Auto-generate username from name if not provided, strip spaces
    const baseUsername = data.username || data.name.replace(/\s+/g, "").toLowerCase();

    // Hash default password if provided, else "tech123"
    const rawPassword = data.password || "tech123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newTech = await db.employee.create({
      data: {
        id: techId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        status: data.status || "Active",
        username: baseUsername,
        password: hashedPassword,
        franchiseId: franchiseId,
        role: data.role || "TECHNICIAN",
        permission: {
          create: {
            modules: data.permissions || [],
          }
        }
      },
      include: {
        permission: true
      }
    });
    res.json(newTech);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/technicians/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.employee.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/reports", async (req: Request, res: Response) => {
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
    const statusMap: Record<string, { amount: number, count: number }> = {};
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
    const serviceMap: Record<string, number> = {};
    let totalServiceRevenue = 0;
    invoices.forEach(i => {
      const s = i.service || "General";
      if (!serviceMap[s]) serviceMap[s] = 0;
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
    const sourceMap: Record<string, number> = {};
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
    const jobStatusMap: Record<string, number> = {};
    jobs.forEach(j => {
      jobStatusMap[j.status] = (jobStatusMap[j.status] || 0) + 1;
    });
    const jobSummary = Object.entries(jobStatusMap).map(([status, count]) => {
      let color = "bg-gray-100 text-gray-700";
      if (status === "Completed") color = "bg-green-100 text-green-700";
      if (status === "Pending") color = "bg-yellow-100 text-yellow-700";
      if (status === "In Progress") color = "bg-blue-100 text-blue-700";
      if (status === "Cancelled") color = "bg-red-100 text-red-700";
      return { status, count, color };
    });

    // Inventory Value
    const inventoryMap: Record<string, { value: number, items: number }> = {};
    inventory.forEach(i => {
      const c = i.category || "General";
      if (!inventoryMap[c]) inventoryMap[c] = { value: 0, items: 0 };
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/employees", async (req: Request, res: Response) => {
  try {
    let tenantFilter: any = { isDeleted: false };
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER" && decoded.franchiseId) {
          tenantFilter.franchiseId = decoded.franchiseId;
        }
      } catch (e) { }
    }
    const list = await db.employee.findMany({
      where: tenantFilter,
      orderBy: { id: "asc" },
      include: {
        franchise: { select: { id: true, name: true, city: true } },
        permission: true
      }
    });
    res.json(list.map(emp => {
      const { password, ...rest } = emp;
      return {
        ...rest,
        permissions: emp.permission?.modules || []
      };
    }));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/hq-employees", async (req: Request, res: Response) => {
  try {
    const list = await db.employee.findMany({
      where: {
        franchiseId: null,
        isDeleted: false,
        status: "Active"
      },
      orderBy: { name: "asc" }
    });
    res.json(list.map(emp => {
      const { password, ...rest } = emp;
      return rest;
    }));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/employees", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let franchiseId: string | null = data.franchiseId || null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;

        // Authorization check: Only SUPER_ADMIN and HQ_USER can create employees
        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER") {
          res.status(403).json({ error: "Unauthorized: Only HQ can create employees" });
          return;
        }

        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER" && decoded.franchiseId) {
          franchiseId = decoded.franchiseId;
        }
      } catch (e) { }
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;
    const normalizedUsername = data.username ? String(data.username).trim().toLowerCase() : null;

    const empId = `EMP${Date.now().toString().slice(-6)}`;

    const newEmployee = await db.employee.create({
      data: {
        id: empId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        status: data.status || "Active",
        username: normalizedUsername,
        password: hashedPassword,
        role: data.role || "TECHNICIAN",
        franchiseId: franchiseId,
        permission: {
          create: {
            modules: data.permissions || [],
          }
        }
      },
      include: {
        permission: true
      }
    });

    const { password, ...rest } = newEmployee;
    res.json({
      ...rest,
      permissions: newEmployee.permission?.modules || []
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/employees/:id", async (req: Request, res: Response) => {
  try {
    let requester = "Admin";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        requester = decoded.username || decoded.role || "Admin";

        // Authorization check: Only SUPER_ADMIN and HQ_USER can edit employees
        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER") {
          res.status(403).json({ error: "Unauthorized: Only HQ can edit employees" });
          return;
        }
      } catch (e) { }
    }

    const id = String(req.params.id);
    const data = req.body;

    const existing = await db.employee.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    let transferPending = false;
    let targetFranchiseId = data.franchiseId;

    // Check if transferring from main branch (franchiseId is null/empty) to a sub-branch (targetFranchiseId is not null/empty)
    if (!existing.franchiseId && targetFranchiseId && targetFranchiseId !== existing.franchiseId) {
      // Check if there is already a Pending request for this employee
      const activeRequest = await db.memberTransferRequest.findFirst({
        where: {
          employeeId: id,
          status: "Pending"
        }
      });

      if (!activeRequest) {
        await db.memberTransferRequest.create({
          data: {
            employeeId: id,
            fromFranchiseId: null,
            toFranchiseId: targetFranchiseId || null,
            requestedBy: requester,
            date: new Date().toISOString().split("T")[0] || "",
            status: "Pending"
          }
        });
      }

      transferPending = true;
      // Do not assign the franchiseId yet; keep it as null (main branch) until approved
      data.franchiseId = null;
    }

    let updateData: any = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      status: data.status,
      role: data.role,
      franchiseId: data.franchiseId || null,
    };

    if (data.username !== undefined) {
      updateData.username = data.username ? String(data.username).trim().toLowerCase() : null;
    }
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    if (data.permissions) {
      updateData.permission = {
        upsert: {
          create: {
            modules: data.permissions,
          },
          update: {
            modules: data.permissions,
          }
        }
      };
    }

    const updated = await db.employee.update({
      where: { id },
      data: updateData,
      include: {
        permission: true
      }
    });

    const { password, ...rest } = updated;
    res.json(rest);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/employees/:id", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;

        // Authorization check: Only SUPER_ADMIN and HQ_USER can delete employees
        if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HQ_USER") {
          res.status(403).json({ error: "Unauthorized: Only HQ can delete employees" });
          return;
        }
      } catch (e) { }
    }

    const id = String(req.params.id);
    await db.employee.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date().toISOString() } });
    res.json({ success: true, message: "Employee deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/attendance", async (req: Request, res: Response) => {
  try {
    let tenantFilter: any = { isDeleted: false };
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;

        if (decoded.role === "SUPER_ADMIN" || decoded.role === "HQ_USER") {
          // HQ sees all
        } else if (decoded.role === "FRANCHISE_ADMIN" || decoded.role === "BRANCH_MANAGER") {
          // Franchise Admin sees their franchise
          tenantFilter.franchiseId = decoded.franchiseId;
        } else {
          // Normal employees see only their own attendance
          tenantFilter.employeeId = decoded.id;
        }
      } catch (e) { }
    }
    const list = await db.attendance.findMany({
      where: tenantFilter,
      orderBy: { date: "desc" },
      include: {
        franchise: { select: { id: true, name: true, city: true } },
        employee: { select: { id: true, name: true, role: true } }
      }
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/attendance/check-in", async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    let franchiseId: string | null = null;

    const emp = await db.employee.findUnique({ where: { id: employeeId } });
    if (!emp) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    franchiseId = emp.franchiseId;

    const date = new Date().toISOString().slice(0, 10);
    const clockIn = new Date().toISOString();

    const existing = await db.attendance.findFirst({
      where: { employeeId, date, isDeleted: false }
    });

    if (existing) {
      res.status(400).json({ error: "Already checked in for today" });
      return;
    }

    const newAttendance = await db.attendance.create({
      data: {
        employeeId,
        date,
        status: "Present",
        clockIn,
        franchiseId,
      },
      include: {
        employee: { select: { id: true, name: true, role: true } }
      }
    });

    res.json(newAttendance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/attendance/check-out", async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    const clockOut = new Date().toISOString();

    const existing = await db.attendance.findFirst({
      where: { employeeId, date, isDeleted: false, clockOut: null }
    });

    if (!existing) {
      res.status(400).json({ error: "No active check-in found for today" });
      return;
    }

    const updated = await db.attendance.update({
      where: { id: existing.id },
      data: { clockOut },
      include: {
        employee: { select: { id: true, name: true, role: true } }
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/attendance/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;

    const updated = await db.attendance.update({
      where: { id },
      data: {
        status: data.status,
        clockIn: data.clockIn,
        clockOut: data.clockOut,
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// File Upload Endpoint
apiRouter.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// MEMBER / BRANCH TRANSFER REQUESTS
// ═══════════════════════════════════════════════════════════════
apiRouter.post("/member-transfers", async (req: Request, res: Response) => {
  try {
    const { employeeId, toFranchiseId, newMemberName, newMemberPhone, newMemberEmail, panNumber, aadharNumber, address, panDocUrl, aadharDocUrl, username, password, role } = req.body;
    let requester = "Admin";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        requester = decoded.username || decoded.role || "Admin";
      } catch (e) { }
    }

    const request = await db.memberTransferRequest.create({
      data: {
        employeeId: employeeId || null,
        fromFranchiseId: null,
        toFranchiseId: toFranchiseId || null,
        newMemberName: newMemberName || null,
        newMemberPhone: newMemberPhone || null,
        newMemberEmail: newMemberEmail || null,
        panNumber: panNumber || null,
        aadharNumber: aadharNumber || null,
        address: address || null,
        panDocUrl: panDocUrl || null,
        aadharDocUrl: aadharDocUrl || null,
        username: username || null,
        password: password || null,
        role: role || "TECHNICIAN",
        requestedBy: requester,
        date: new Date().toISOString().split("T")[0] || "",
        status: "Pending"
      }
    });

    res.json(request);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/member-transfers", async (req: Request, res: Response) => {
  try {
    const requests = await db.memberTransferRequest.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" }
    });

    const enriched = await Promise.all(requests.map(async (r) => {
      let empName = r.newMemberName || "Unknown";
      let empRole = r.role || "TECHNICIAN";
      if (r.employeeId) {
        const emp = await db.employee.findUnique({
          where: { id: r.employeeId },
          select: { name: true, role: true }
        });
        if (emp) {
          empName = emp.name;
          empRole = emp.role;
        }
      }

      let toFranchise = null;
      if (r.toFranchiseId) {
        toFranchise = await db.franchise.findUnique({
          where: { id: r.toFranchiseId },
          select: { name: true, city: true }
        });
      }

      return {
        ...r,
        employeeName: empName,
        employeeRole: empRole,
        toFranchiseName: toFranchise?.name || "Unknown",
        toFranchiseCity: toFranchise?.city || "Unknown"
      };
    }));

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/member-transfers/:id/approve", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const request = await db.memberTransferRequest.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ error: "Transfer request not found" });
      return;
    }

    if (request.status !== "Pending") {
      res.status(400).json({ error: `Request already ${request.status.toLowerCase()}` });
      return;
    }

    // Determine user role
    const authHeader = req.headers.authorization;
    let userRole = "UNKNOWN";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "shifterz_secret_key") as any;
        userRole = decoded.role;
      } catch (e) { }
    }

    let hqApproved = true;
    let adminApproved = true;

    // Check if fully approved
    const isFullyApproved = true;

    if (!isFullyApproved) {
      // Update flags and return without creating employee
      const updatedRequest = await db.memberTransferRequest.update({
        where: { id },
        data: { hqApproved, adminApproved }
      });
      res.json(updatedRequest);
      return;
    }

    let finalUsername: string | undefined;
    let finalPassword: string | undefined;

    if (!request.employeeId) {
      // Create a new employee on approval
      const empId = `EMP${Date.now().toString().slice(-6)}`;
      let baseUsername = request.username || (request.newMemberName || "user").toLowerCase().replace(/\s+/g, "_");
      let username = baseUsername;

      // Ensure username uniqueness
      const existingUser = await db.employee.findUnique({ where: { username } });
      if (existingUser) {
        // Append franchise prefix for clarity instead of random numbers
        const franchisePrefix = request.toFranchiseId ? request.toFranchiseId.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
        username = franchisePrefix ? `${baseUsername}_${franchisePrefix}` : `${baseUsername}_${Date.now().toString().slice(-4)}`;
        // Double-check uniqueness
        const stillExists = await db.employee.findUnique({ where: { username } });
        if (stillExists) {
          username = `${baseUsername}_${Date.now().toString().slice(-6)}`;
        }
      }

      finalUsername = username;
      finalPassword = (request.password || "password123") as string;
      const hashedPassword = await bcrypt.hash(finalPassword as string, 10);

      await db.employee.create({
        data: {
          id: empId,
          name: request.newMemberName || "New Member",
          phone: request.newMemberPhone || null,
          email: request.newMemberEmail || null,
          status: "Active",
          username,
          password: hashedPassword,
          role: request.role || "TECHNICIAN",
          franchiseId: request.toFranchiseId
        }
      });
      console.log(`[APPROVAL] Created employee username: "${username}" with ID ${empId}`);
    } else {
      // Update Employee branch
      await db.employee.update({
        where: { id: request.employeeId },
        data: { franchiseId: request.toFranchiseId }
      });
    }

    // Update Request status and store final username
    const updateData: any = { status: "Approved", hqApproved: true, adminApproved: true };
    if (finalUsername) {
      updateData.username = finalUsername;
    }

    const updatedRequest = await db.memberTransferRequest.update({
      where: { id },
      data: updateData
    });

    // Return the final credentials so the frontend can display them
    res.json({
      ...updatedRequest,
      finalUsername: finalUsername || undefined,
      finalPassword: finalPassword || undefined
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/member-transfers/:id/reject", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const request = await db.memberTransferRequest.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ error: "Transfer/Recruitment request not found" });
      return;
    }

    if (request.status !== "Pending") {
      res.status(400).json({ error: `Request already ${request.status.toLowerCase()}` });
      return;
    }

    // Update Request status
    const updatedRequest = await db.memberTransferRequest.update({
      where: { id },
      data: { status: "Rejected" }
    });

    res.json(updatedRequest);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/member-transfers/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { newMemberName, newMemberPhone, newMemberEmail, panNumber, aadharNumber, address, panDocUrl, aadharDocUrl, username, password, role } = req.body;
    const updated = await db.memberTransferRequest.update({
      where: { id },
      data: {
        newMemberName: newMemberName || null,
        newMemberPhone: newMemberPhone || null,
        newMemberEmail: newMemberEmail || null,
        panNumber: panNumber || null,
        aadharNumber: aadharNumber || null,
        address: address || null,
        panDocUrl: panDocUrl || null,
        aadharDocUrl: aadharDocUrl || null,
        username: username || null,
        password: password || null,
        role: role || null
      }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/member-transfers/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.memberTransferRequest.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date().toISOString() }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

