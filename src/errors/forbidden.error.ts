import ErrorCode from '@enums/error-code.enum';
import StatusCode from '@enums/status-code.enum';

import BaseError from './base.error';

class ForbiddenError extends BaseError {
  constructor(code?: ErrorCode) {
    super(code || ErrorCode.Forbidden, StatusCode.Forbidden);
  }
}

export default ForbiddenError;
