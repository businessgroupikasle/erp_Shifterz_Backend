import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";


dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Shifterz database...");

  // Clean old data
  await prisma.attendance.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.inventoryRequest.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.service.deleteMany();
  await prisma.outPass.deleteMany();
  await prisma.carIn.deleteMany();
  await prisma.job.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.franchise.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.rolePermission.deleteMany();

  // Role Permissions Seed Matrix
  const DEFAULT_MATRIX = {
    SUPER_ADMIN: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "employees", "attendance", "settings", "roles"],
    HQ_USER: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "employees", "attendance", "settings"],
    FRANCHISE_ADMIN: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "employees", "attendance"],
    BRANCH_MANAGER: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "attendance"],
    RECEPTION_EXECUTIVE: ["dashboard", "carin", "outpass", "customers", "leads"],
    SERVICE_ADVISOR: ["dashboard", "carin", "jobs", "customers", "leads"],
    TECHNICIAN: ["dashboard", "jobs", "attendance"],
    QUALITY_INSPECTOR: ["dashboard", "jobs", "carin"],
    BILLING_EXECUTIVE: ["dashboard", "billing", "payments", "reports"],
    INVENTORY_EXECUTIVE: ["dashboard", "inventory", "reports"],
  };

  await prisma.rolePermission.createMany({
    data: Object.entries(DEFAULT_MATRIX).map(([role, permissions]) => ({
      role,
      permissions,
    })),
  });
  // Settings
  await prisma.setting.create({
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

  // Employees
  const techPassword = await bcrypt.hash("tech123", 10);
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.employee.createMany({
    data: [
      { id: "TECH-001", name: "Arjun", username: "arjun", password: techPassword, phone: "9876543201", email: "arjun@shifterz.in", status: "Active", role: "TECHNICIAN" },
      { id: "TECH-002", name: "Sathish", username: "sathish", password: techPassword, phone: "9876543202", email: "sathish@shifterz.in", status: "Active", role: "TECHNICIAN" },
      { id: "TECH-003", name: "Mani", username: "mani", password: techPassword, phone: "9876543203", email: "mani@shifterz.in", status: "Active", role: "TECHNICIAN" },
      { id: "TECH-004", name: "Kumar", username: "kumar", password: techPassword, phone: "9876543204", email: "kumar@shifterz.in", status: "Active", role: "TECHNICIAN" },
      {
        id: "USR-001",
        name: "Admin",
        username: "admin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
      {
        id: "USR-001-HQ",
        name: "HQ Admin",
        username: "hqadmin",
        password: hashedPassword,
        role: "HQ_USER",
      }
    ]
  });




  // Services
  await prisma.service.createMany({
    data: [
      { id: "SVC001", name: "PPF Full Body", category: "PPF", price: 45000, duration: "2 days", warranty: "10 years", desc: "Full body paint protection film" },
      { id: "SVC002", name: "PPF Bonnet + Roof", category: "PPF", price: 18000, duration: "4 hours", warranty: "10 years", desc: "" },
      { id: "SVC003", name: "PPF Partial (Hood)", category: "PPF", price: 8000, duration: "2 hours", warranty: "10 years", desc: "" },
      { id: "SVC004", name: "C3 Pro Coating", category: "Coating", price: 22000, duration: "1 day", warranty: "3 years", desc: "CarPro C3 professional coating" },
      { id: "SVC005", name: "Ceramic Coating", category: "Coating", price: 18000, duration: "1 day", warranty: "2 years", desc: "" },
      { id: "SVC006", name: "Graphene Coating", category: "Coating", price: 35000, duration: "2 days", warranty: "5 years", desc: "Premium graphene-infused coating" },
      { id: "SVC007", name: "Interior Detailing", category: "Detailing", price: 8500, duration: "5 hours", warranty: "—", desc: "" },
      { id: "SVC008", name: "Paint Correction (1-step)", category: "Detailing", price: 12000, duration: "8 hours", warranty: "—", desc: "" },
      { id: "SVC009", name: "Full Paint Correction", category: "Detailing", price: 22000, duration: "2 days", warranty: "—", desc: "" },
      { id: "SVC010", name: "Window Tinting", category: "Add-on", price: 12000, duration: "3 hours", warranty: "3 years", desc: "" },
    ],
  });

  // Leads
  await prisma.lead.createMany({
    data: [
      { id: "L001", name: "Ramesh Kumar", phone: "98765 43210", email: "ramesh@mail.com", source: "JustDial", service: "PPF Full Body", vehicle: "TN 04 AB 1234", assignedTo: "Arjun", status: "Follow Up", notes: "Interested in ceramic too", date: "2026-05-28", budget: "45000" },
      { id: "L002", name: "Priya Nair", phone: "87654 32109", email: "priya@mail.com", source: "Instagram", service: "C3 Coating", vehicle: "KL 01 CD 5678", assignedTo: "Sathish", status: "New", notes: "", date: "2026-05-29", budget: "22000" },
      { id: "L003", name: "Vikram Shah", phone: "76543 21098", email: "vikram@mail.com", source: "Referral", service: "PPF Bonnet", vehicle: "MH 02 EF 9012", assignedTo: "Arjun", status: "Closed", notes: "Job done", date: "2026-05-27", budget: "18000" },
      { id: "L004", name: "Arun Patel", phone: "65432 10987", email: "arun@mail.com", source: "Facebook", service: "Graphene Coating", vehicle: "TN 09 GH 3456", assignedTo: "Mani", status: "Lost", notes: "Price issue", date: "2026-05-26", budget: "35000" },
      { id: "L005", name: "Sunita Reddy", phone: "54321 09876", email: "sunita@mail.com", source: "JustDial", service: "Interior Detailing", vehicle: "AP 28 IJ 7890", assignedTo: "Sathish", status: "New", notes: "", date: "2026-05-30", budget: "8500" },
    ],
  });

  // Invoices
  await prisma.invoice.createMany({
    data: [
      { id: "INV-2601", type: "Invoice", client: "Ramesh Kumar", phone: "98765 43210", vehicle: "TN 04 AB 1234", service: "PPF Full Body", amount: 45000, gst: 8100, discount: 0, status: "Paid", date: "2026-05-28", dueDate: "2026-05-28", notes: "" },
      { id: "QT-2602", type: "Quotation", client: "Priya Nair", phone: "87654 32109", vehicle: "KL 01 CD 5678", service: "C3 Coating", amount: 22000, gst: 3960, discount: 0, status: "Pending", date: "2026-05-29", dueDate: "2026-06-05", notes: "" },
      { id: "PRF-2603", type: "Proforma", client: "Siva Anand", phone: "91234 56789", vehicle: "TN 07 MN 2345", service: "Ceramic Coating", amount: 18000, gst: 3240, discount: 1000, status: "Pending", date: "2026-05-27", dueDate: "2026-06-03", notes: "1000 discount applied" },
      { id: "INV-2604", type: "Invoice", client: "Karthik Raj", phone: "43210 98765", vehicle: "TN 11 OP 6789", service: "Graphene Coating", amount: 35000, gst: 6300, discount: 0, status: "Overdue", date: "2026-05-20", dueDate: "2026-05-27", notes: "" },
      { id: "EST-2605", type: "Estimate", client: "Deepa Menon", phone: "23456 78901", vehicle: "KL 05 QR 1234", service: "Interior Detailing", amount: 8500, gst: 1530, discount: 500, status: "Approved", date: "2026-05-26", dueDate: "2026-06-02", notes: "" },
    ],
  });

  // Payments
  await prisma.payment.createMany({
    data: [
      { id: "PAY001", invoiceId: "INV-2601", client: "Ramesh Kumar", amount: 53100, mode: "UPI", date: "2026-05-28", ref: "UPI-RK8791", notes: "" },
      { id: "PAY002", invoiceId: "INV-2604", client: "Karthik Raj", amount: 20000, mode: "Cash", date: "2026-05-22", ref: "CASH-001", notes: "Partial payment" },
    ],
  });

  // Inventory
  await prisma.inventory.createMany({
    data: [
      { id: "ITM001", name: "XPEL PPF Film", unit: "Meter", category: "PPF", stock: 42, reorder: 10, cost: 850, supplier: "XPEL India", location: "Rack A1" },
      { id: "ITM002", name: "C3 Pro Coating Kit", unit: "Kit", category: "Coating", stock: 8, reorder: 5, cost: 4500, supplier: "CarPro", location: "Rack B2" },
      { id: "ITM003", name: "Gyeon Quartz Coat", unit: "Bottle", category: "Coating", stock: 3, reorder: 5, cost: 6200, supplier: "Gyeon", location: "Rack B3" },
      { id: "ITM004", name: "Ceramic Pro 9H", unit: "Bottle", category: "Coating", stock: 12, reorder: 5, cost: 5800, supplier: "Ceramic Pro", location: "Rack B1" },
      { id: "ITM005", name: "Microfibre Towels", unit: "Piece", category: "Consumable", stock: 85, reorder: 20, cost: 120, supplier: "Local", location: "Rack C1" },
      { id: "ITM006", name: "Isopropyl Alcohol 1L", unit: "Litre", category: "Chemical", stock: 15, reorder: 10, cost: 180, supplier: "Local", location: "Rack C2" },
      { id: "ITM007", name: "Clay Bar Kit", unit: "Kit", category: "Consumable", stock: 22, reorder: 10, cost: 650, supplier: "Menzerna", location: "Rack C3" },
      { id: "ITM008", name: "Graphene Coating 50ml", unit: "Bottle", category: "Coating", stock: 4, reorder: 5, cost: 7500, supplier: "CarPro", location: "Rack B4" },
    ],
  });

  // Franchise
  await prisma.franchise.createMany({
    data: [
      { id: "F001", name: "Shifterz Chennai", city: "Chennai", owner: "Balaji S", phone: "98400 11111", since: "2024-01-15", revenue: 380000, jobs: 48, royaltyPct: 5, status: "Active" },
      { id: "F002", name: "Shifterz Bangalore", city: "Bangalore", owner: "Ravi Kumar", phone: "98400 22222", since: "2024-04-10", revenue: 520000, jobs: 65, royaltyPct: 5, status: "Active" },
      { id: "F003", name: "Shifterz Hyderabad", city: "Hyderabad", owner: "Anand P", phone: "98400 33333", since: "2024-07-20", revenue: 290000, jobs: 38, royaltyPct: 5, status: "Active" },
      { id: "F004", name: "Shifterz Pune", city: "Pune", owner: "Suresh M", phone: "98400 44444", since: "2024-11-01", revenue: 140000, jobs: 22, royaltyPct: 5, status: "Trial" },
      { id: "F005", name: "Shifterz Kochi", city: "Kochi", owner: "Jithin K", phone: "98400 55555", since: "2025-02-14", revenue: 95000, jobs: 15, royaltyPct: 5, status: "Trial" },
    ],
  });

  // Customers
  const branchPassword = await bcrypt.hash("branch123", 10);
  await prisma.employee.create({
    data: {
      id: "USR-002",
      name: "Branch Admin",
      username: "branchadmin",
      password: branchPassword,
      role: "FRANCHISE_ADMIN",
      franchiseId: "F001"
    },
  });

  await prisma.customer.createMany({
    data: [
      { id: "CUS001", name: "Ramesh Kumar", phone: "98765 43210", email: "ramesh@mail.com", vehicle: "TN 04 AB 1234", model: "Toyota Fortuner", visits: 3, totalSpend: 97000, lastVisit: "2026-05-28" },
      { id: "CUS002", name: "Priya Nair", phone: "87654 32109", email: "priya@mail.com", vehicle: "KL 01 CD 5678", model: "Honda City", visits: 1, totalSpend: 0, lastVisit: "2026-05-29" },
      { id: "CUS003", name: "Karthik Raj", phone: "43210 98765", email: "karthik@mail.com", vehicle: "TN 11 OP 6789", model: "BMW 3 Series", visits: 2, totalSpend: 55000, lastVisit: "2026-05-20" },
    ],
  });

  // CarIn
  await prisma.carIn.createMany({
    data: [
      { id: "CAR001", vehicle: "TN 04 AB 1234", model: "Toyota Fortuner", customer: "Ramesh Kumar", phone: "98765 43210", service: "PPF Full Body", technicianIn: "Arjun", inTime: "2026-05-31T09:15:00", outTime: null, status: "In Workshop", odometer: "42500", notes: "Handle with care - white pearl", jobCardId: "JOB001" },
      { id: "CAR002", vehicle: "KL 01 CD 5678", model: "Honda City", customer: "Priya Nair", phone: "87654 32109", service: "C3 Coating", technicianIn: "Sathish", inTime: "2026-05-31T10:30:00", outTime: "2026-05-31T17:45:00", status: "Delivered", odometer: "18900", notes: "", jobCardId: "JOB002" },
    ],
  });

  // Jobs
  await prisma.job.createMany({
    data: [
      { id: "JOB001", vehicle: "TN 04 AB 1234", customer: "Ramesh Kumar", service: "PPF Full Body", technician: "Arjun", status: "In Progress", priority: "High", startDate: "2026-05-31", estCompletion: "2026-06-01", actualCompletion: null, notes: "Stage 1: Paint correction done" },
      { id: "JOB002", vehicle: "KL 01 CD 5678", customer: "Priya Nair", service: "C3 Coating", technician: "Sathish", status: "Completed", priority: "Normal", startDate: "2026-05-31", estCompletion: "2026-05-31", actualCompletion: "2026-05-31", notes: "" },
    ],
  });

  // OutPass
  await prisma.outPass.createMany({
    data: [
      { id: "OP001", vehicle: "KL 01 CD 5678", model: "Honda City", customer: "Priya Nair", phone: "87654 32109", service: "C3 Coating", outTime: "2026-05-31T17:45:00", securityName: "Murugan", technicianName: "Sathish", remarks: "All clear. Washed and ready.", issued: true, carInId: "CAR002" },
    ],
  });

  // Today's Date for Dashboard Metrics
  const todayStr = new Date().toISOString().split("T")[0];

  // Attendance
  await prisma.attendance.createMany({
    data: [
      { employeeId: "TECH-001", date: todayStr, status: "Present", clockIn: "08:50", franchiseId: "F001" },
      { employeeId: "TECH-002", date: todayStr, status: "Present", clockIn: "08:55", franchiseId: "F001" },
      { employeeId: "TECH-003", date: todayStr, status: "Absent", franchiseId: "F001" },
      { employeeId: "TECH-004", date: todayStr, status: "Present", clockIn: "09:05", franchiseId: "F001" },
    ],
  });

  // Appointments
  await prisma.appointment.createMany({
    data: [
      { customerName: "Anita Rao", vehicle: "Hyundai Creta", scheduledDate: todayStr, service: "General Service", status: "Scheduled", franchiseId: "F001" },
      { customerName: "Vivek Menon", vehicle: "Kia Seltos", scheduledDate: todayStr, service: "Ceramic Coating", status: "Arrived", franchiseId: "F001" },
      { customerName: "Rajesh S", vehicle: "Mahindra Thar", scheduledDate: todayStr, service: "Interior Detailing", status: "Scheduled", franchiseId: "F001" },
    ],
  });

  // Inventory Requests
  await prisma.inventoryRequest.createMany({
    data: [
      { itemId: "ITM001", quantityRequested: 10, status: "Pending", date: todayStr, franchiseId: "F001" },
      { itemId: "ITM004", quantityRequested: 5, status: "Pending", date: todayStr, franchiseId: "F001" },
      { itemId: "ITM002", quantityRequested: 2, status: "Approved", date: todayStr, franchiseId: "F001" },
    ],
  });

  // Inject a lead, carIn, invoice and job for TODAY so the CRM and Revenue dashboard widgets pop!
  await prisma.lead.create({
    data: { id: "L999", name: "Today Lead", phone: "11111 22222", email: "today@mail.com", source: "Walk-in", service: "Wash", vehicle: "TN 99 AA 9999", assignedTo: "Arjun", status: "New", notes: "", date: todayStr, budget: "5000", franchiseId: "F001" }
  });
  
  await prisma.carIn.create({
    data: { id: "CAR999", vehicle: "TN 99 AA 9999", model: "Maruti Swift", customer: "Today Lead", phone: "11111 22222", service: "Wash", technicianIn: "Arjun", inTime: `${todayStr}T09:00:00`, status: "In Workshop", odometer: "12000", notes: "", jobCardId: "JOB999", franchiseId: "F001" }
  });
  
  await prisma.job.create({
    data: { id: "JOB999", vehicle: "TN 99 AA 9999", customer: "Today Lead", service: "Wash", technician: "Arjun", status: "In Progress", priority: "Normal", startDate: todayStr, estCompletion: todayStr, notes: "", franchiseId: "F001" }
  });

  await prisma.invoice.create({
    data: { id: "INV-TODAY", type: "Invoice", client: "Today Lead", phone: "11111 22222", vehicle: "TN 99 AA 9999", service: "Wash", amount: 5000, gst: 900, discount: 0, status: "Paid", date: todayStr, dueDate: todayStr, notes: "", franchiseId: "F001" }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
