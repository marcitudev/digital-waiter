import { Request, Response } from "express";
import { ValidationException } from "../exceptions/validation.exception";

interface ResponseError {
    resource: string,
    method: string,
    status: number,
    code: string,
    message: string
}

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
        console.error('Handling error with Validation Exception:', responseError);
    } else {
        console.error(error);
    }

    return res.status(responseError.status).json(responseError);
}