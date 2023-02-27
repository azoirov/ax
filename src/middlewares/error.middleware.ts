import { NextFunction, Request, Response } from 'express';

import ErrorCode from '@enums/error-code.enum';
import StatusCode from '@enums/status-code.enum';

export const errorResponder = (error, req: Request, res: Response, next: NextFunction) => {
    if (!error.statusCode) {
        return res.status(StatusCode.InternalServerError).json({
            error: {
                code: ErrorCode.ServerError,
                message: error.message
            },
        });
    }

    if (error.name === ErrorCode.ValidationError) {
        return res.status(error.statusCode).json({
            error: {
                code: error.name,
                message: error.message,
                data: error.data,
            },
        });
    }

    res.status(error.statusCode).json({
        error: {
            code: error.name,
            data: error.data,
        },
    });

    next();
};
