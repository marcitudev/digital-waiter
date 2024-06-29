import pool from '../config/db';

// models
import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user.model';
import { ErrorEnum } from '../enums/error.enum';
import { StatusCode } from '../enums/status-code.enum';

// services
import addressService from './address.service';
import phoneService from './phone.service';

// repository
import userRepository from '../repositories/user.repository';
import { ValidationException } from '../exceptions/validation.exception';

class UserService{
    
    async create(user: User): Promise<UserDTO>{
        await pool.connect();

        try{
            await pool.query('BEGIN');

            const { address, phone } = user;
            if(!address) throw new ValidationException(StatusCode.NOT_FOUND, ErrorEnum.ADDRESS_NOT_FOUND, 'Address not found');
            if(!phone) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_PHONE_NUMBER, 'Invalid phone number');

            user.address = await addressService.create(address);
            user.phone = await phoneService.create(phone);

            const userRegistered: UserDTO = await userRepository.create(user);

            await pool.query('COMMIT');

            return userRegistered;
        } catch(error) {
            await pool.query('ROLLBACK');
            throw new Error(error as string);
        } finally {
            await pool.end();
        }
    }

    async getById(id: number): Promise<UserDTO | null>{
        const user = await userRepository.getById(id);
        if(!user) throw new ValidationException(StatusCode.NOT_FOUND, ErrorEnum.USER_NOT_FOUND, 'User not found');
        return user;
    }

}

export default new UserService();