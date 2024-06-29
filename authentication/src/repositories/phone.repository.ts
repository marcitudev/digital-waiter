import { QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';
import { Phone } from '../models/phone.model';
import pool from '../config/db';
import { ErrorEnum } from '../enums/error.enum';

class PhoneRepository extends GenericRepository<Phone>{

    constructor(){
        super('phone_numbers');
    }

    async getById(id: number): Promise<Phone | null>{
        return this.getByAttributeEqualTo('id', id.toString(), this.buildPhone);
    }

    async existsById(id: number): Promise<boolean>{
        return this.existsByAttributeEqualTo('id', id.toString());
    }

    async create(ddd: string, number: string): Promise<Phone>{
        return new Promise<Phone>((resolve, reject) => {
            const query = `
                INSERT INTO adresses(
                    ddd, 
                    phone_number
                )
                VALUES(
                    ${ ddd }, 
                    ${ number }
                )
                RETURNING *
            `
            pool.query(query, (error, response) => {
                if(error) reject(ErrorEnum.INVALID_PHONE_NUMBER);
                if(response) resolve(this.buildPhone(response.rows[0]));
            });
        });
    }

    private async buildPhone(phone: QueryResultRow): Promise<Phone>{
        return new Phone(
            phone?.id,
            phone.ddd.concat(phone.phone_number));
    }

}

export default new PhoneRepository();