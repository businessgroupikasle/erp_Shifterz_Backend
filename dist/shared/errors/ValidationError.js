import { ApiError } from './ApiError.js';
export class ValidationError extends ApiError {
    constructor(message) {
        super(400, message);
    }
}
//# sourceMappingURL=ValidationError.js.map