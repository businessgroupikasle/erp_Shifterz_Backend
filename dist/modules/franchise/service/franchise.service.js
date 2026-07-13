import { FranchiseRepository } from '../repository/franchise.repository.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
export class FranchiseService {
    repository;
    constructor(repository = new FranchiseRepository()) {
        this.repository = repository;
    }
    async getAllFranchises() {
        return this.repository.findAll();
    }
    async getFranchiseById(id) {
        const franchise = await this.repository.findById(id);
        if (!franchise) {
            throw new NotFoundError("Franchise not found");
        }
        return franchise;
    }
    async createFranchise(data) {
        const franchiseId = generateUid("FRN");
        return this.repository.create(franchiseId, data);
    }
    async updateFranchise(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new NotFoundError("Franchise not found");
        }
        return this.repository.update(id, data);
    }
    async deleteFranchise(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new NotFoundError("Franchise not found");
        }
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=franchise.service.js.map