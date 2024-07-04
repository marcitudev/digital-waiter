import { QueryResultRow } from 'pg';
import { Address } from '../models/address.model';
import { GenericRepository } from './generic.repository';
import cityRepository from './city.repository';
import pool from '../config/db';

class AddressRepository extends GenericRepository<Address>{

    constructor(){
        super('adresses');
    }

    async getById(id: number): Promise<Address | null>{
        return super.getByAttributeEqualTo('id', id.toString(), this.buildAddress);
    }

    async create(address: Address): Promise<Address>{
        return new Promise<Address>((resolve, reject) => {
            const { road, neighbourhood, city, number } = address;
            const query = `
                INSERT INTO adresses(
                    road, 
                    neighbourhood, 
                    city_id, 
                    number
                )
                VALUES(
                    $1, $2, $3, $4
                )
                RETURNING *
            `

            const values = [
                road.trim(),
                neighbourhood.trim(),
                city.id,
                number
            ];

            pool.query(query, values, (error, response) => {
                if(error) reject(error);
                if(response) resolve(this.buildAddress(response.rows[0]));
            });
        });
    }

    private async buildAddress(address: QueryResultRow): Promise<Address>{
        const city = await cityRepository.getById(address?.city_id);

        return new Address(
            address?.id,
            address?.road,
            address?.neighbourhood,
            city!,
            address?.number);
    }

}

export default new AddressRepository();