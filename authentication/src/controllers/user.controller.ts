import * as express from 'express';
import { Request, Response } from 'express';

// services
import userService from '../services/user.service';
import { controllerExceptionHandler } from '../utils/exception-handler';

const route = express.Router();

route.post('/create', async (req: Request, res: Response) => {
    try{
        const user = await userService.create(req.body);
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