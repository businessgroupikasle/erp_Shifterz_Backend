import { OutpassService } from '../service/outpass.service.js';
export class OutpassController {
    service;
    constructor(service = new OutpassService()) {
        this.service = service;
    }
    getAllOutpasses = async (req, res, next) => {
        try {
            const list = await this.service.getAllOutpasses();
            res.json(list);
        }
        catch (error) {
            next(error);
        }
    };
    createOutpass = async (req, res, next) => {
        try {
            const result = await this.service.createOutpass(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    updateOutpass = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const result = await this.service.updateOutpass(id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=outpass.controller.js.map