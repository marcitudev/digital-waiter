import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user.model';
import pool from '../config/db';
import { Status } from '../enums/status.enum';
import { ErrorEnum } from '../enums/error.enum';
import { QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';

class UserRepository extends GenericRepository<UserDTO> {

    constructor(){
        super('users');
    }

    async create(user: User): Promise<UserDTO>{
        return new Promise<UserDTO>((resolve, reject) => {
            const { firstName, lastName, cpf, email, password, phone, address, status } = user;
            const query = `
                INSERT INTO users(
                    first_name, 
                    last_name, 
                    cpf, 
                    email, 
                    address_id, 
                    phone_number_id,
                    status,
                    password
                )
                VALUES(
                    LTRIM(RTRIM('${ firstName }')), 
                    LTRIM(RTRIM('${ lastName }')), 
                    '${ cpf.value }', 
                    '${ email.value }', 
                    ${ address.id }, 
                    ${ phone.id },
                    ${ Status[status] },
                    pgp_sym_encrypt(LTRIM(RTRIM('${ password }')), '${ process.env.CRYPTO_KEY }'), 
                )
                RETURNING *
            `
            pool.query(query, (error, response) => {
                if(error) reject(ErrorEnum.INVALID_USER);
                if(response) resolve(this.buildUser(response.rows[0]));
            });
        });
    }

    async getById(id: number): Promise<UserDTO | null>{
        return this.getByAttributeEqualTo('id', id.toString(), this.buildUser);
    }

    private buildUser(user: QueryResultRow): UserDTO{
        return new UserDTO(
            user?.id,
            user?.first_name,
            user?.last_name);
    }

}

export default new UserRepository();