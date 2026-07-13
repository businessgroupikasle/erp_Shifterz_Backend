import { ApiError } from './ApiError.js';

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(401, message);
  }
}
