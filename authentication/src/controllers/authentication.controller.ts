import * as express from 'express';
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { ErrorEnum } from '../enums/error.enum';
import { validationResultHandler } from '../utils/validation-result-handler';
import { controllerExceptionHandler } from '../utils/exception-handler';
import authenticationService from '../services/authentication.service';

const route = express.Router();

route.post('', [
    body('email').notEmpty().withMessage(ErrorEnum.EMAIL_IS_REQUIRED)
                 .isLength({ min: 6, max: 255 }).withMessage(ErrorEnum.INVALID_EMAIL),
    body('password').notEmpty().withMessage(ErrorEnum.PASSWORD_IS_REQUIRED)
                    .isLength({ min: 6, max: 30 }).withMessage(ErrorEnum.INVALID_PASSWORD)
], async (req: Request, res: Response) => {
    try{
        validationResultHandler(req);

        const { email, password } = req.body;
        const authentication = await authenticationService.authenticate(email, password);

        return res.status(200).json(authentication);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }

});

route.post('/refresh-token', [
    body('refreshToken').notEmpty().withMessage(ErrorEnum.REFRESH_TOKEN_IS_REQUIRED)
], async (req: Request, res: Response) => {
    try{
        validationResultHandler(req);

        const { refreshToken } = req.body;
        const authentication = await authenticationService.refresh(refreshToken);
        
        return res.status(200).json(authentication);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }

});

export default route;