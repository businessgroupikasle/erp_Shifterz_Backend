import { db } from '../../../lib/db.js';

export class VehicleRepository {
  async findCustomerByVehicle(vehicleNo: string) {
    return db.customer.findFirst({ where: { vehicle: vehicleNo } });
  }

  async findCarInByVehicle(vehicleNo: string) {
    return db.carIn.findFirst({ 
      where: { vehicle: vehicleNo }, 
      orderBy: { inTime: "desc" } 
    });
  }

  async findLeadByVehicle(vehicleNo: string) {
    return db.lead.findFirst({ 
      where: { vehicle: vehicleNo }, 
      orderBy: { date: "desc" } 
    });
  }
}
