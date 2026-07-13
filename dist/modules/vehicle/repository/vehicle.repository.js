import { db } from '../../../lib/db.js';
export class VehicleRepository {
    async findCustomerByVehicle(vehicleNo) {
        return db.customer.findFirst({ where: { vehicle: vehicleNo } });
    }
    async findCarInByVehicle(vehicleNo) {
        return db.carIn.findFirst({
            where: { vehicle: vehicleNo },
            orderBy: { inTime: "desc" }
        });
    }
    async findLeadByVehicle(vehicleNo) {
        return db.lead.findFirst({
            where: { vehicle: vehicleNo },
            orderBy: { date: "desc" }
        });
    }
}
//# sourceMappingURL=vehicle.repository.js.map