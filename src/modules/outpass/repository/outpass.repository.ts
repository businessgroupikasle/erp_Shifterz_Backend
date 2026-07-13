import { db } from '../../../lib/db.js';
import type { CreateOutpassDTO, UpdateOutpassDTO } from '../validation/outpass.validation.js';

export class OutpassRepository {
  async findAll() {
    return db.outPass.findMany({ orderBy: { outTime: "desc" } });
  }

  async create(id: string, data: CreateOutpassDTO) {
    return db.outPass.create({
      data: {
        id,
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
  }

  async update(id: string, data: UpdateOutpassDTO) {
    return db.outPass.update({
      where: { id },
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
  }
}
