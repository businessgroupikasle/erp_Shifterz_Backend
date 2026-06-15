import { db } from "./db.js";
import bcrypt from "bcrypt";
export async function autoSeed() {
    try {
        const userCount = await db.user.count();
        if (userCount === 0) {
            console.log("No users found in database. Running auto-seed...");
            // Seed Settings
            await db.setting.upsert({
                where: { id: "default" },
                update: {},
                create: {
                    id: "default",
                    companyName: "Shifterz",
                    address: "42, Race Course Rd, Coimbatore – 641018",
                    phone: "0422-123 4567",
                    email: "info@shifterz.in",
                    gstin: "33AAAAA0000A1Z5",
                    gstPct: 18,
                    currency: "₹",
                    agents: ["Arjun", "Sathish", "Mani"],
                }
            });
            // Seed Technicians
            const techCount = await db.technician.count();
            if (techCount === 0) {
                await db.technician.createMany({
                    data: [
                        { id: "TECH-001", name: "Arjun", phone: "9876543201", email: "arjun@shifterz.in", status: "Active" },
                        { id: "TECH-002", name: "Sathish", phone: "9876543202", email: "sathish@shifterz.in", status: "Active" },
                        { id: "TECH-003", name: "Mani", phone: "9876543203", email: "mani@shifterz.in", status: "Active" },
                        { id: "TECH-004", name: "Kumar", phone: "9876543204", email: "kumar@shifterz.in", status: "Active" },
                    ]
                });
            }
            // Seed Admin User
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await db.user.create({
                data: {
                    id: "USR-001",
                    username: "admin",
                    password: hashedPassword,
                    role: "admin",
                }
            });
            console.log("Auto-seed completed successfully!");
        }
        else {
            console.log(`Database already has ${userCount} user(s). Auto-seed skipped.`);
        }
    }
    catch (error) {
        console.error("Auto-seed failed:", error);
    }
}
//# sourceMappingURL=autoSeed.js.map