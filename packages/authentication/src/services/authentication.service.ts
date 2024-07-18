// import from shared-service
import { AuthUser, Authentication, ErrorEnum, StatusCode, ValidationException } from 'shared-service';

import { promisify } from 'util';
import userService from './user.service';
import * as jwt from 'jsonwebtoken';

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
            const user = await userService.getByEmail(decoded.email);

            if(!user) 
                throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');

            const { id, email } = user;
            return this.generateToken(id, email);
        } catch(error){
            if (error instanceof jwt.TokenExpiredError) {
                throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.EXPIRED_TOKEN, 'Refresh token expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.INVALID_TOKEN, 'Invalid refresh token');
            } else {
                throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');
            }

        }
    }

    private generateToken(id: number, email: string): Authentication{
        const accessToken = jwt.sign({ id, email }, process.env.AUTH_KEY as string, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ email }, process.env.AUTH_KEY as string, { expiresIn: '7d' });
        
        return { accessToken, refreshToken };
    }

}

export default new AuthenticationService();