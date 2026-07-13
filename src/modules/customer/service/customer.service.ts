import { CustomerRepository } from '../repository/customer.repository.js';
import type { CreateCustomerDTO } from '../validation/customer.validation.js';
import { generateUid } from '../../../shared/utils/idGenerator.js';

export class CustomerService {
  constructor(private readonly repository: CustomerRepository = new CustomerRepository()) {}

  async getCustomers(tenantFilter: any) {
    return this.repository.findAll(tenantFilter);
  }

  async createCustomer(data: CreateCustomerDTO, franchiseId: string | null) {
    const custId = generateUid("CUST");
    return this.repository.create(custId, data, franchiseId);
  }

  async deleteCustomer(id: string) {
    return this.repository.softDelete(id);
  }
}
