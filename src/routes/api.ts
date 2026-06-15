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

apiRouter.delete("/leads/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.lead.delete({ where: { id } });
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
        status: data.status,
        notes: data.notes,
        dueDate: data.dueDate,
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
    await db.invoice.delete({ where: { id } });
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
    await db.payment.delete({ where: { id } });
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

apiRouter.delete("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.job.delete({ where: { id } });
    res.json({ success: true, message: "Job deleted" });
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
    await db.franchise.delete({ where: { id } });
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
    const list = await db.customer.findMany({ orderBy: { totalSpend: "desc" } });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/customers", async (req: Request, res: Response) => {
  try {
    const data = req.body;
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
    await db.customer.delete({ where: { id } });
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
        },
      });
    }
    const techs = await db.technician.findMany();

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
      salesAgents: settings.agents
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put("/settings", async (req: Request, res: Response) => {
  try {
    const { companyInfo, technicians, salesAgents } = req.body;
    
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
      },
    });

    if (Array.isArray(technicians)) {
      await db.technician.deleteMany();
      for (const t of technicians) {
        await db.technician.create({
          data: {
            id: `TECH_${Math.random().toString(36).substr(2, 9)}`,
            name: t,
            phone: "",
            email: "",
            status: "Active"
          }
        });
      }
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
