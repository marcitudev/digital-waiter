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
        const client = await pool.connect();
        
        try{
            await client.query('BEGIN');
            
            const { firstName, lastName, cpf, address, phone, password } = user;

            const existsByCpf = await userRepository.existsByCpf(cpf.value);

            if(existsByCpf) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.CPF_ALREADY_EXISTS, 'CPF already exists');
            if(!address) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_ADDRESS, 'Invalid address');
            if(!phone) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_PHONE_NUMBER, 'Invalid phone number');
            if(!firstName) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_FISTNAME, 'Invalid first name');
            if(!lastName) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_LASTNAME, 'Invalid last name');
            if(!password) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_PASSWORD, 'Invalid password');

            user.address = await addressService.create(address);
            user.phone = await phoneService.create(phone);

            const userRegistered: UserDTO = await userRepository.create(user);

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