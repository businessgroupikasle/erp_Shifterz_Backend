import { ApiError } from './ApiError.js';
export class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden access') {
        super(403, message);
    }
}
//# sourceMappingURL=ForbiddenError.js.map