import { Router, type Request, type Response } from "express";
import { db } from "../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const apiRouter = Router();

// Helper to generate unique IDs
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

    const user = await db.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "shifterz_secret_key",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shifterz_secret_key") as any;


    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error: any) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});


// ═══════════════════════════════════════════════════════════════
// DASHBOARD ANALYTICS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/dashboard", async (req: Request, res: Response): Promise<void> => {
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

    res.json({
      revenue: totalRev,
      carsInCount: carsInWorkshop.length,
      activeLeadsCount,
      pendingOverdueAmount: pendingAndOverdue,
      overdueCount,
      lowStockCount: lowStockItems.length,
      lowStockList: lowStockItems.map(itm => itm.name),
      carsInList: carsInWorkshop.slice(0, 5),
      recentLeadsList: leads.slice(0, 5),
      leadsCount: leads.length,
      invoicesCount: invoices.length,
      franchiseList: franchise.map(f => ({
        city: f.city,
        revenue: f.revenue,
        jobs: f.jobs,
        owner: f.owner,
      })),
    });
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
    const carId = uid("CAR");
    const jobCardId = uid("JOB");

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
          id: uid("CUS"),
          name: data.customer || "Walk-in",
          phone: data.phone || "",
          email: "",
          vehicle: data.vehicle,
          model: data.model || "",
          visits: 1,
          totalSpend: 0,
          lastVisit: new Date().toISOString().slice(0, 10),
        },
      });
    }

    res.json(newCar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check-out a car and generate out pass
apiRouter.put("/carin/:id/checkout", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
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
          securityName: "Murugan", // Default security staff
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

// ═══════════════════════════════════════════════════════════════
// LEADS (CRM)
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/leads", async (req: Request, res: Response) => {
  try {
    const list = await db.lead.findMany({ orderBy: { date: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/leads", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newLead = await db.lead.create({
      data: {
        id: uid("L"),
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
      },
    });
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
    res.json(updated);
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
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/invoices", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const pre = data.type === "Invoice" ? "INV" : data.type === "Quotation" ? "QT" : data.type === "Proforma" ? "PRF" : "EST";
    const invId = `${pre}-${Date.now().toString().slice(-4)}`;

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
        status: data.status,
        notes: data.notes,
        dueDate: data.dueDate,
      },
    });
    res.json(updated);
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
    await db.service.delete({ where: { id } });
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
    await db.inventory.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// JOB CARDS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/jobs", async (req: Request, res: Response) => {
  try {
    const list = await db.job.findMany({ orderBy: { estCompletion: "asc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/jobs", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const jobId = uid("JOB");
    const newJob = await db.job.create({
      data: {
        id: jobId,
        vehicle: data.vehicle,
        customer: data.customer || "",
        service: data.service || "",
        technician: data.technician || "",
        status: data.status || "Pending",
        priority: data.priority || "Normal",
        startDate: data.startDate || new Date().toISOString().slice(0, 10),
        estCompletion: data.estCompletion || new Date().toISOString().slice(0, 10),
        actualCompletion: null,
        notes: data.notes || "",
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
        status: data.status,
        priority: data.priority,
        estCompletion: data.estCompletion,
        actualCompletion: data.actualCompletion || null,
        notes: data.notes,
      },
    });
    res.json(updated);
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

// ═══════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/customers", async (req: Request, res: Response) => {
  try {
    const list = await db.customer.findMany({ orderBy: { totalSpend: "desc" } });
    res.json(list);
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
        },
      });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/settings", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const settings = await db.setting.upsert({
      where: { id: "default" },
      update: {
        companyName: data.companyName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        gstin: data.gstin,
        gstPct: Number(data.gstPct || 18),
        currency: data.currency || "₹",
        agents: data.agents || [],
      },
      create: {
        id: "default",
        companyName: data.companyName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        gstin: data.gstin,
        gstPct: Number(data.gstPct || 18),
        currency: data.currency || "₹",
        agents: data.agents || [],
      },
    });
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// TECHNICIANS
// ═══════════════════════════════════════════════════════════════
apiRouter.get("/technicians", async (req: Request, res: Response) => {
  try {
    const list = await db.technician.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/technicians", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const techId = uid("TECH");
    const newTech = await db.technician.create({
      data: {
        id: techId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        status: data.status || "Active",
      },
    });
    res.json(newTech);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete("/technicians/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.technician.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
