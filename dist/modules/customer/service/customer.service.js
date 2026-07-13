import { CustomerRepository } from '../repository/customer.repository.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';
export class CustomerService {
    repository;
    constructor(repository = new CustomerRepository()) {
        this.repository = repository;
    }
    async getCustomers(tenantFilter) {
        return this.repository.findAll(tenantFilter);
    }
    async createCustomer(data, franchiseId) {
        const custId = generateUid("CUST");
        return this.repository.create(custId, data, franchiseId);
    }
    async deleteCustomer(id) {
        return this.repository.softDelete(id);
    }
}
//# sourceMappingURL=customer.service.js.map