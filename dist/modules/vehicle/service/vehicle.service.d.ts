import { VehicleRepository } from '../repository/vehicle.repository.js';
export declare class VehicleService {
    private readonly repository;
    constructor(repository?: VehicleRepository);
    lookupVehicle(vehicleNo: string): Promise<{
        name: string;
        phone: string;
        email: string;
        model: string;
    } | {
        name: string;
        phone: string;
        model: string;
        email?: undefined;
    } | {
        name: string;
        phone: string;
        email?: undefined;
        model?: undefined;
    }>;
}
//# sourceMappingURL=vehicle.service.d.ts.map