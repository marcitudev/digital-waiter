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
        const decoded = await this.verifyToken(refreshToken);
        const user = await userService.getByEmail(decoded.email);

        if(!user) 
            throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');

        const { id, email } = user;
        return this.generateToken(id, email);
    }

    async validateRequest(token: string): Promise<AuthUser>{
        if(!token) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'Authorization header is required');

        const decoded = await this.verifyToken(token);
        if(!decoded.id) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');

        const user = await userService.getById(decoded.id);
        if(!user) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');

        return { id: user.id, email: user.email };
    }

    async verifyToken(token: string): Promise<AuthUser>{
        try {
            return await this.verifyAsync(token, process.env.AUTH_KEY as string) as AuthUser;
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