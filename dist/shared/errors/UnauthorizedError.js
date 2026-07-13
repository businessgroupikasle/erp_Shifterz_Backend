import { ApiError } from './ApiError.js';
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized access') {
        super(401, message);
    }
}
//# sourceMappingURL=UnauthorizedError.js.map