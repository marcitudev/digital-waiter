import * as express from 'express';
import { Request, Response } from 'express';

// models
import { User } from '../models/user.model';

// services
import userService from '../services/user.service';

// utils
import { controllerExceptionHandler } from '../utils/exception-handler';

const route = express.Router();

route.post('/', async (req: Request, res: Response) => {
    try{
        const user = await userService.create(User.transformAnInstanceIntoAUser(req.body));
        return res.json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try{
        const user = await userService.getById(parseInt(req.params.id));
        return res.json(user);
    } catch(error){
        controllerExceptionHandler(req, res, error);
    }
});

export default route;