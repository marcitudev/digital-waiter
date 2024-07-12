import pool from '../config/db';
import { ValidationException } from '../exceptions/validation.exception';

// models
import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user.model';
import { ErrorEnum } from '../enums/error.enum';
import { StatusCode } from '../enums/status-code.enum';
import { Status } from '../enums/status.enum';

// services
import addressService from './address.service';
import phoneService from './phone.service';

// repository
import userRepository from '../repositories/user.repository';

class UserService{
    
    async create(user: User): Promise<UserDTO>{
        const client = await pool.connect();
        
        try{
            await client.query('BEGIN');
            
            const { cpf, email, address, phone } = user;

            const existsByCpf = await userRepository.existsByCpf(cpf.value);
            if(existsByCpf) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.CPF_ALREADY_EXISTS, 'CPF already exists');
            
            const existsByEmail = await userRepository.existsByEmail(email.value);
            if(existsByEmail) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.EMAIL_ALREADY_EXISTS, 'Email already exists');

            if(!address) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_ADDRESS, 'Invalid address');
            if(!phone) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_PHONE_NUMBER, 'Invalid phone number');

            user.address = await addressService.create(address, client);
            user.phone = await phoneService.create(phone, client);

            user.status = Status.ACTIVE;
            const userRegistered: UserDTO = await userRepository.create(user, client);

            await client.query('COMMIT');

            return userRegistered;
        } catch(error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getById(id: number): Promise<UserDTO | null>{
        const user = await userRepository.getById(id);
        if(!user) throw new ValidationException(StatusCode.NOT_FOUND, ErrorEnum.USER_NOT_FOUND, 'User not found');
        return user;
    }

}

export default new UserService();