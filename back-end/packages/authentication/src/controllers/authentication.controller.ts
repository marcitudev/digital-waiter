// import from shared-service
import { ErrorEnum, validationResultHandler, controllerExceptionHandler, AuthenticationRequest, decrypt } from 'shared-service';

import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { body, cookie } from 'express-validator';
import authenticationService from '../services/authentication.service';

const route = express.Router();

type keyValueTuple = [string, string];
const routesWithoutAuthentication: Array<keyValueTuple> = [
    ['POST', '/users']
]

route.post('', decrypt, [
    body('email').notEmpty().withMessage(ErrorEnum.EMAIL_IS_REQUIRED)
                 .isLength({ min: 6, max: 255 }).withMessage(ErrorEnum.INVALID_EMAIL),
    body('password').notEmpty().withMessage(ErrorEnum.PASSWORD_IS_REQUIRED)
                    .isLength({ min: 6, max: 30 }).withMessage(ErrorEnum.INVALID_PASSWORD)
], async (req: Request, res: Response) => {
    try{
        validationResultHandler(req);

        const { email, password } = req.body;
        const authentication = await authenticationService.authenticate(email, password);
        const [ tokens, user ] = authentication;

        res.cookie('authentication', JSON.stringify(tokens), { httpOnly: true });
        return res.status(200).json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

route.post('/refresh-token', [
    cookie('authentication').notEmpty().withMessage(ErrorEnum.REFRESH_TOKEN_IS_REQUIRED)
], async (req: Request, res: Response) => {
    try{
        validationResultHandler(req);

        const authCookies = JSON.parse(req.cookies.authentication);
        const { refreshToken } = authCookies;

        const authentication = await authenticationService.refresh(refreshToken);
        const [ tokens, user ] = authentication;
        
        res.cookie('authentication', JSON.stringify(tokens), { httpOnly: true });
        return res.status(200).json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

export const verifyToken = async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    try{
        const routeDontNeedAuthentication = routesWithoutAuthentication.some(([ method, path ]) => {
            return method.toLowerCase() === req.method.toLowerCase() && path.toLowerCase() === req.originalUrl.toLowerCase();
        });
        if(routeDontNeedAuthentication) return next();
    
        const authCookies = JSON.parse(req.cookies.authentication);
        const { accessToken } = authCookies;
        const user = await authenticationService.validateRequest(accessToken ?? '');

        req.user = user;
    
        return next();
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
}

export default route;