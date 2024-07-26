// import from shared-service
import { ValidationException } from '../exceptions/validation.exception';
import { ResponseError } from '../interfaces/response-error.interface';

import { Request, Response } from 'express';

export function controllerExceptionHandler(req: Request, res: Response, error: unknown){
    let responseError: ResponseError = {
        resource: req.baseUrl,
        method: req.method,
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error'
    };

    if(error instanceof ValidationException) {
        responseError = { ...responseError, ...error }
        console.error(new Date(), '-', 'Handling error with Validation Exception:', responseError);
    } else {
        console.error(new Date(), '-', error);
    }

    return res.status(responseError.status).json(responseError);
}