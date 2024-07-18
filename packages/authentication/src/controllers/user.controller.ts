// import from shared-service
import { User, controllerExceptionHandler } from 'shared-service';

import * as express from 'express';
import { Request, Response } from 'express';

// services
import userService from '../services/user.service';


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