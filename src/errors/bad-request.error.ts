import ErrorCode from '@enums/error-code.enum';
import StatusCode from '@enums/status-code.enum';

import BaseError from './base.error';

class BadRequestError extends BaseError {
  constructor(name: ErrorCode, data?: any, message?: string) {
    super(name, StatusCode.BadRequest, data);

    this.message = message;
  }
}

export default BadRequestError;
