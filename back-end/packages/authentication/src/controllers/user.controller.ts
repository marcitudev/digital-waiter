// import from shared-service
import { AuthenticationRequest, ErrorEnum, User, controllerExceptionHandler, validationResultHandler } from 'shared-service';

import * as express from 'express';
import { Request, Response } from 'express';

// services
import userService from '../services/user.service';
import { body } from 'express-validator';


const route = express.Router();

route.post('/', async (req: Request, res: Response) => {
    try{
        const user = await userService.create(User.transformAnInstanceIntoAUser(req.body));
        return res.json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

route.get('/user/:id', async (req: Request, res: Response) => {
    try{
        const user = await userService.getById(parseInt(req.params.id));
        return res.json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

route.get('/auth-user', async (req: AuthenticationRequest, res: Response) => {
    try{
        const userId: number = req.user?.id ?? 0;

        const user = await userService.getById(userId);
        return res.json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

route.post('/change-password', [
    body('oldPassword').notEmpty().withMessage(ErrorEnum.PASSWORD_IS_REQUIRED)
                       .isLength({ min: 6, max: 30 }).withMessage(ErrorEnum.INVALID_PASSWORD),
    body('newPassword').notEmpty().withMessage(ErrorEnum.NEW_PASSWORD_IS_REQUIRED)
                       .isLength({ min: 6, max: 30 }).withMessage(ErrorEnum.INVALID_NEW_PASSWORD)
], async (req: AuthenticationRequest, res: Response) => {
    try{
        validationResultHandler(req);

        const { user } = req;
        const { oldPassword, newPassword } = req.body;

        await userService.changePassword(user?.id ?? 0, oldPassword, newPassword);

        return res.status(200).json();
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

export default route;