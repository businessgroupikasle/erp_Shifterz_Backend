import { OutpassRepository } from '../repository/outpass.repository.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
export class OutpassService {
    repository;
    constructor(repository = new OutpassRepository()) {
        this.repository = repository;
    }
    async getAllOutpasses() {
        return this.repository.findAll();
    }
    async createOutpass(data) {
        const passId = generateUid("OP");
        return this.repository.create(passId, data);
    }
    async updateOutpass(id, data) {
        return this.repository.update(id, data);
    }
}
//# sourceMappingURL=outpass.service.js.map