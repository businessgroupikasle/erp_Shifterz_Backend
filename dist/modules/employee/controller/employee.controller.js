import { EmployeeService } from '../service/employee.service.js';
export class EmployeeController {
    service;
    constructor(service = new EmployeeService()) {
        this.service = service;
    }
    getAllEmployees = async (req, res, next) => {
        try {
            const userRole = req.user?.role || "UNKNOWN";
            const userFranchiseId = req.user?.franchiseId || undefined;
            const list = await this.service.getAllEmployees(userRole, userFranchiseId);
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    getHqEmployees = async (req, res, next) => {
        try {
            const list = await this.service.getHqEmployees();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    getTechnicians = async (req, res, next) => {
        try {
            const list = await this.service.getTechnicians();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createEmployee = async (req, res, next) => {
        try {
            const userRole = req.user?.role || "UNKNOWN";
            const userFranchiseId = req.user?.franchiseId || undefined;
            const result = await this.service.createEmployee(req.body, userRole, userFranchiseId, false);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    createTechnician = async (req, res, next) => {
        try {
            const userRole = req.user?.role || "UNKNOWN";
            const userFranchiseId = req.user?.franchiseId || undefined;
            const result = await this.service.createEmployee(req.body, userRole, userFranchiseId, true);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateEmployee = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateEmployee(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteEmployee = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            await this.service.deleteEmployee(id);
            res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=employee.controller.js.map