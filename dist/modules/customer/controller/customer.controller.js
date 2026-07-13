import { CustomerService } from '../service/customer.service.js';
export class CustomerController {
    service;
    constructor(service = new CustomerService()) {
        this.service = service;
    }
    getCustomers = async (req, res, next) => {
        try {
            let tenantFilter = {};
            if (req.user) {
                if (req.user.role !== "SUPER_ADMIN" && req.user.role !== "HQ_USER" && req.user.franchiseId) {
                    tenantFilter = { franchiseId: req.user.franchiseId };
                }
            }
            const customers = await this.service.getCustomers(tenantFilter);
            res.json(customers);
        }
        catch (error) {
            next(error);
        }
    };
    createCustomer = async (req, res, next) => {
        try {
            const franchiseId = req.user?.franchiseId || null;
            const customer = await this.service.createCustomer(req.body, franchiseId);
            res.json(customer);
        }
        catch (error) {
            next(error);
        }
    };
    deleteCustomer = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteCustomer(id);
            res.json({ success: true, message: "Customer deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=customer.controller.js.map