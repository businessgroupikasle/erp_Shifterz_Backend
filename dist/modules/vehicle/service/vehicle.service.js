import { VehicleRepository } from '../repository/vehicle.repository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
export class VehicleService {
    repository;
    constructor(repository = new VehicleRepository()) {
        this.repository = repository;
    }
    async lookupVehicle(vehicleNo) {
        const customer = await this.repository.findCustomerByVehicle(vehicleNo);
        if (customer) {
            return {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                model: customer.model
            };
        }
        const carIn = await this.repository.findCarInByVehicle(vehicleNo);
        if (carIn) {
            return {
                name: carIn.customer,
                phone: carIn.phone,
                model: carIn.model
            };
        }
        const lead = await this.repository.findLeadByVehicle(vehicleNo);
        if (lead) {
            return {
                name: lead.name,
                phone: lead.phone
            };
        }
        throw new NotFoundError("Vehicle not found in any records");
    }
}
//# sourceMappingURL=vehicle.service.js.map