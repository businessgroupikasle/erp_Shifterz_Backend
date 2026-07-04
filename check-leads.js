import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const leads = await prisma.lead.findMany({ orderBy: { date: 'desc' }, take: 5 });
  console.log(leads);
}

check().catch(console.error).finally(() => prisma.$disconnect());
