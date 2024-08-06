import { NextFunction, Request, Response } from 'express';
import * as CryptoJS from 'crypto-js';
import { controllerExceptionHandler } from '../utils/exception-handler';
import { ValidationException } from '../exceptions/validation.exception';
import { StatusCode } from '../enums/status-code.enum';
import { ErrorEnum } from '../enums/error.enum';
import * as dotenv from 'dotenv';

dotenv.config();

const decrypt = (req: Request, res: Response, next: NextFunction) => {
    if(req.body) {
        try{
            const { data } = req.body;
            req.body = decryptData(data);
        } catch(error) {
            return controllerExceptionHandler(req, res, error);
        }
    }
    next();
}

const decryptData = (data: string): unknown => {
    if(!data) 
        throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_FORMAT, 'Invalid encrypted data');

    const bytes = CryptoJS.AES.decrypt(data, process.env.REQ_BODY_CRYPTO_KEY as string);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
}

export { decrypt };