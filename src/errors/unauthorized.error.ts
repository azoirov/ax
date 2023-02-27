import ErrorCode from '@enums/error-code.enum';
import StatusCode from '@enums/status-code.enum';

import BaseError from './base.error';

class UnauthorizedError extends BaseError {
  constructor(name?: ErrorCode, message?: string) {
    super(name || ErrorCode.Unauthorized, StatusCode.Unauthorized, { message });
  }
}

export default UnauthorizedError;
