import { ApiError } from '../shared/errors/ApiError.js';
import { logger } from '../shared/logger/logger.js';
import { ZodError } from 'zod';
export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: err.errors
        });
        return;
    }
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
        return;
    }
    logger.error(err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
};
//# sourceMappingURL=error.middleware.js.map