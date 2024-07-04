import * as express from 'express';
import { Request, Response } from 'express';

// services
import userService from '../services/user.service';

// utils
import { controllerExceptionHandler } from '../utils/exception-handler';
import { Status } from '../enums/status.enum';
import { User } from '../models/user.model';
import { Phone } from '../models/phone.model';

const route = express.Router();

route.post('/', async (req: Request, res: Response) => {
    try{
        const { firstName, lastName, cpf, email, phone, address, password } = req.body;
        const phoneEntity = new Phone(null, phone);

        const user = await userService.create(new User(null, firstName, lastName, cpf, email, phoneEntity, address, Status.ACTIVE, password));
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