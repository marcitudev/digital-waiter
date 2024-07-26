// import from shared-service
import { validationResult } from 'express-validator';
import { ValidationException } from '../exceptions/validation.exception';
import { StatusCode } from '../enums/status-code.enum';
import { ErrorEnum } from '../enums/error.enum';

import { Request } from 'express';

export function validationResultHandler(req: Request){
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorsList = errors.array();

        const firstError = errorsList.find(({ msg }) => !!ErrorEnum[msg as keyof typeof ErrorEnum]);

        throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum[firstError?.msg as keyof typeof ErrorEnum] || 'INVALID_PARAMS', 'Invalid request params');
    }
}