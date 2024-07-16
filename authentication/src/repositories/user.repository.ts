import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user.model';
import pool from '../config/db';
import { PoolClient, QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';

class UserRepository extends GenericRepository<UserDTO> {

    constructor(){
        super('users');
    }

    async create(user: User, client?: PoolClient): Promise<UserDTO>{
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
                    $1, $2, $3, $4, $5, $6, $7, pgp_sym_encrypt($8, $9)
                )
                RETURNING *
            `;

            const values = [
                firstName.trim(),                                         // $1
                lastName.trim(),                                          // $2
                cpf.value,                                                // $3
                email.value,                                              // $4
                address.id,                                               // $5
                phone.id,                                                 // $6
                status,                                                   // $7
                password.trim(),                                          // $8
                process.env.CRYPTO_KEY                                    // $9
            ];

            const agentQuery = client || pool;

            agentQuery.query(query, values, (error, response) => {
                if(error) reject(error);
                if(response) resolve(this.buildUser(response.rows[0]));
            });
        });
    }

    async getById(id: number): Promise<UserDTO | null>{
        return super.getByAttributeEqualTo('id', id, this.buildUser);
    }

    async existsByCpf(cpf: string): Promise<boolean>{
        return super.existsByAttributeEqualTo('cpf', cpf);
    }

    async existsByEmail(email: string): Promise<boolean>{
        return super.existsByAttributeEqualTo('email', email);
    }

    async getByEmail(email: string): Promise<UserDTO | null>{
        return super.getByAttributeEqualTo('LOWER(email)', email.toLowerCase(), this.buildUser);
    }

    async getByEmailAndPassword(email: string, password: string): Promise<UserDTO | null>{
        const attrMap = new Map<string, string>();
        attrMap.set(`LOWER(email)`, email.toLowerCase());
        attrMap.set(`pgp_sym_decrypt(password, '${process.env.CRYPTO_KEY}')`, password);

        return super.getByAttributesEqualTo(attrMap, this.buildUser);
    }

    private buildUser(user: QueryResultRow): UserDTO{
        return new UserDTO(
            user?.id,
            user?.first_name,
            user?.last_name);
    }

}

export default new UserRepository();