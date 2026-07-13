import { ApiError } from './ApiError.js';

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden access') {
    super(403, message);
  }
}
