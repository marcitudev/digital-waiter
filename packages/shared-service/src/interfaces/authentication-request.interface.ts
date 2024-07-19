import { Request } from 'express';
import { AuthUser } from './auth-user.interface';

export interface AuthenticationRequest extends Request {
    user?: AuthUser
}