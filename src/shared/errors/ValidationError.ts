import { ApiError } from './ApiError.js';

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}
