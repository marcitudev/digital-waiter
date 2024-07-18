// import from shared-service
import { Phone } from 'shared-service';

import { PoolClient, QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';
import pool from '../config/db';

class PhoneRepository extends GenericRepository<Phone>{

    constructor(){
        super('phone_numbers');
    }

    async getById(id: number): Promise<Phone | null>{
        return super.getByAttributeEqualTo('id', id.toString(), this.buildPhone);
    }

    async existsById(id: number): Promise<boolean>{
        return super.existsByAttributeEqualTo('id', id.toString());
    }

    async create(ddd: string, number: string, client?: PoolClient): Promise<Phone>{
        return new Promise<Phone>((resolve, reject) => {
            const query = `
                INSERT INTO phone_numbers(
                    ddd, 
                    phone_number
                )
                VALUES(
                    $1, $2
                )
                RETURNING *
            `

            const values = [
                ddd,
                number
            ];

            const agentQuery = client || pool;

            agentQuery.query(query, values, (error, response) => {
                if(error) reject(error);
                if(response) resolve(this.buildPhone(response.rows[0]));
            });
        });
    }

    async existsByDDDAndPhoneNumber(ddd: string, number: string){
        const attrMap: Map<string, string> = new Map<string, string>();
        attrMap.set('ddd', ddd);
        attrMap.set('phone_number', number);

        return super.existsByAttributesEqualTo(attrMap);
    }

    private async buildPhone(phone: QueryResultRow): Promise<Phone>{
        return new Phone(
            phone?.id,
            phone.ddd.concat(phone.phone_number));
    }

}

export default new PhoneRepository();