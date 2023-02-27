import ErrorCode from '@enums/error-code.enum';
import StatusCode from '@enums/status-code.enum';

import BaseError from './base.error';

class NotFoundError extends BaseError {
  constructor(code: ErrorCode, data?: any) {
    super(code, StatusCode.NotFound, data);
  }
}

export default NotFoundError;
