// import from shared-service
import { User, UserDTO, Email, ErrorEnum, StatusCode, Status, ValidationException, pool } from 'shared-service';

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

    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void>{
        if(!userId) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_USER, 'Invalid user');

        if(oldPassword === newPassword) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.THE_NEW_PASSWORD_MUST_BE_FROM_THE_OLD_ONE, 'The new password must be different from the old one');

        const existsByIdAndPassword = await userRepository.existsByIdAndPassword(userId, oldPassword);
        if(!existsByIdAndPassword) throw new ValidationException(StatusCode.UNAUTHORIZED, ErrorEnum.INVALID_PASSWORD, 'Invalid password');

        await userRepository.changePassword(userId, newPassword);
    }

    async getById(id: number): Promise<UserDTO | null>{
        const user = await userRepository.getById(id);
        if(!user) throw new ValidationException(StatusCode.NOT_FOUND, ErrorEnum.USER_NOT_FOUND, 'User not found');
        return user;
    }

    async getByEmailAndPassword(email: string, password: string): Promise<UserDTO | null> {
        const emailObject = new Email(email);
        return await userRepository.getByEmailAndPassword(emailObject.value, password);
    }

    async getByEmail(email: string): Promise<UserDTO | null>{
        const emailObject = new Email(email);
        return await userRepository.getByEmail(emailObject.value);
    }

}

export default new UserService();