import { promisify } from 'util';
import { ErrorEnum } from '../enums/error.enum';
import { StatusCode } from '../enums/status-code.enum';
import { ValidationException } from '../exceptions/validation.exception';
import { Authentication } from '../interfaces/authentication.interface';
import userService from './user.service';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from '../interfaces/auth-user.interface';

class AuthenticationService{

    private verifyAsync: (token: string, key: string) => Promise<unknown>;

    constructor() {
        this.verifyAsync = promisify(jwt.verify);
    }

    async authenticate(email: string, password: string): Promise<Authentication>{
        const user = await userService.getByEmailAndPassword(email, password);
        if(!user) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');
        
        return this.generateToken(user.id, email);
    }

    async refresh(refreshToken: string): Promise<Authentication | void>{
        try {
            const decoded = await this.verifyAsync(refreshToken, process.env.AUTH_KEY as string) as AuthUser;

            const { email } = decoded;
            if(email) {
                const user = await userService.getByEmail(email);
    
                if(user) {
                    return this.generateToken(user.id, email);
                } 
    
            }

            throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');
        } catch(error){
            throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');
        }
    }

    private generateToken(id: number, email: string): Authentication{
        const accessToken = jwt.sign({ id, email }, process.env.AUTH_KEY as string, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ email }, process.env.AUTH_KEY as string, { expiresIn: '7d' });
        
        return { accessToken, refreshToken };
    }

}

export default new AuthenticationService();