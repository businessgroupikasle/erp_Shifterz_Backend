import { JobCardRepository } from '../repository/job-card.repository.js';
import { generateSequentialId } from '../../../shared/utils/idGenerator.js';
export class JobCardService {
    repository;
    constructor(repository = new JobCardRepository()) {
        this.repository = repository;
    }
    async getJobs(filter) {
        return this.repository.findAll(filter);
    }
    async createJob(data) {
        const jobId = await generateSequentialId("JOB");
        let techId = data.technicianId || null;
        if (!techId && data.technician) {
            const techRecord = await this.repository.findEmployeeByName(data.technician);
            if (techRecord)
                techId = techRecord.id;
        }
        return this.repository.create(jobId, data, techId);
    }
    async updateJob(id, data) {
        return this.repository.update(id, data);
    }
    async deleteJob(id) {
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=job-card.service.js.map