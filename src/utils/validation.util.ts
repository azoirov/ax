import { plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

import { validationMessageFormatter } from '@utils/get-validation-message.util';

import BadRequestError from '@errors/bad-request.error';

import ErrorCode from '@enums/error-code.enum';

export const validation = async (
  type: any,
  body: any,
  options?: {
    skipMissingProperties?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
  },
): Promise<void> => {
  const validatorOptions: ValidatorOptions = {
    skipMissingProperties: options?.skipMissingProperties || false,
    whitelist: options?.whitelist || false,
    forbidNonWhitelisted: options?.forbidNonWhitelisted || true,
  };

  const errors: ValidationError[] = await validate(plainToClass(type, body), validatorOptions);

  if (errors.length > 0) {
    const message = validationMessageFormatter(errors);

    throw new BadRequestError(ErrorCode.ValidationError, errors, message);
  }
};
