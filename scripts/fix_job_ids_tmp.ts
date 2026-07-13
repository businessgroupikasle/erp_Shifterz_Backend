import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.job.updateMany({ where: { technicianId: 'TECH001' }, data: { technicianId: 'TECH-001' } });
  await prisma.job.updateMany({ where: { technicianId: 'TECH002' }, data: { technicianId: 'TECH-002' } });
  await prisma.job.updateMany({ where: { technicianId: 'TECH003' }, data: { technicianId: 'TECH-003' } });
  
  const jobs = await prisma.job.findMany();
  for(let j of jobs) {
    if(!j.technicianId && j.technician) {
      const t = await prisma.technician.findFirst({ where: { name: j.technician } });
      if(t) {
        await prisma.job.update({ where: { id: j.id }, data: { technicianId: t.id } });
      }
    }
  }
  
  console.log('Fixed missing hyphens and nulls');
}

main().finally(() => prisma.$disconnect());
