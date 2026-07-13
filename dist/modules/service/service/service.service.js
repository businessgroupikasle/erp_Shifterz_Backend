import { ServiceRepository } from '../repository/service.repository.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
export class ServiceService {
    repository;
    constructor(repository = new ServiceRepository()) {
        this.repository = repository;
    }
    async getAllServices() {
        return this.repository.findAll();
    }
    async getServiceById(id) {
        const service = await this.repository.findById(id);
        if (!service) {
            throw new NotFoundError("Service not found");
        }
        return service;
    }
    async createService(data) {
        const serviceId = generateUid("SRV");
        return this.repository.create(serviceId, data);
    }
    async updateService(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new NotFoundError("Service not found");
        }
        return this.repository.update(id, data);
    }
    async deleteService(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new NotFoundError("Service not found");
        }
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=service.service.js.map