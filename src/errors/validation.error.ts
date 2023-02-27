import ErrorCode from '@enums/error-code.enum';
import StatusCode from '@enums/status-code.enum';

import BaseError from './base.error';

class ValidationError extends BaseError {
  constructor(code: ErrorCode, message) {
    super(ErrorCode.ValidationError, StatusCode.BadRequest, message);
  }
}

export default ValidationError;
