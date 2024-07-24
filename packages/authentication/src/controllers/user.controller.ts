// import from shared-service
import { AuthenticationRequest, ErrorEnum, User, controllerExceptionHandler, validationResultHandler } from 'shared-service';

import * as express from 'express';
import { Request, Response } from 'express';

// services
import userService from '../services/user.service';
import { body } from 'express-validator';


const route = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               address:
 *                type: object
 *                properties:
 *                  street:
 *                      type: string
 *                      example: 123 Main St
 *                  neighbourhood:
 *                      type: string
 *                      example: Baker St
 *                  city:
 *                      type: object
 *                      properties:
 *                       id: 
 *                          type: number
 *                          example: 1
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               age:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 age:
 *                   type: integer
 *                   example: 30
 *       500:
 *         description: Internal server error
 */
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