import { db } from '../../lib/db.js';

const idCounters: Record<string, number> = {
  CUS: 0,
  INV: 0,
  QT: 0,
  EST: 0,
  L: 0,
  JOB: 0,
};

export const generateSequentialId = async (prefix: string): Promise<string> => {
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

export const generateUid = (prefix: string) => `${prefix}${Date.now().toString(36).toUpperCase()}`;
