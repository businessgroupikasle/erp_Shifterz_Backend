import { ApiError } from './ApiError.js';
export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}
//# sourceMappingURL=NotFoundError.js.map