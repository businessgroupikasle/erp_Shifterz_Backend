import { OutpassRepository } from '../repository/outpass.repository.js';
import type { CreateOutpassDTO, UpdateOutpassDTO } from '../validation/outpass.validation.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';

export class OutpassService {
  constructor(private readonly repository: OutpassRepository = new OutpassRepository()) {}

  async getAllOutpasses() {
    return this.repository.findAll();
  }

  async createOutpass(data: CreateOutpassDTO) {
    const passId = generateUid("OP");
    return this.repository.create(passId, data);
  }

  async updateOutpass(id: string, data: UpdateOutpassDTO) {
    return this.repository.update(id, data);
  }
}
