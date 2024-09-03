// import from shared-service
import { AuthUser, Authentication, ErrorEnum, StatusCode, UserDTO, ValidationException } from 'shared-service';

import { promisify } from 'util';
import userService from './user.service';
import * as jwt from 'jsonwebtoken';

class AuthenticationService{

    private verifyAsync: (token: string, key: string) => Promise<unknown>;

    constructor() {
        this.verifyAsync = promisify(jwt.verify);
    }

    async authenticate(email: string, password: string): Promise<[Authentication, UserDTO]>{
        const user = await userService.getByEmailAndPassword(email, password);
        if(!user) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');
        
        const { id, firstName, lastName } = user;

        const tokens = this.generateTokens(id, firstName, lastName, email);
        return [tokens, user];
    }

    async refresh(refreshToken: string): Promise<[Authentication, UserDTO]>{
        const decoded = await this.verifyToken(refreshToken);
        const user = await userService.getByEmail(decoded.email);

        if(!user) 
            throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'User unauthorized');

        const { id, firstName, lastName, email } = user;

        const tokens = this.generateTokens(id, firstName, lastName, email);
        return [tokens, user];
    }

    async validateRequest(token: string): Promise<AuthUser>{
        if(!token) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.UNAUTHORIZED, 'Authorization is required');

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

    private generateTokens(id: number, firstName: string, lastName: string, email: string): Authentication{
        const accessToken = jwt.sign({ id, firstName, lastName, email }, process.env.AUTH_KEY as string, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ email }, process.env.AUTH_KEY as string, { expiresIn: '7d' });
        
        return { accessToken, refreshToken };
    }

}

export default new AuthenticationService();