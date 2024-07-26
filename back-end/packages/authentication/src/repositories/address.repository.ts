// import from shared-service
import { Address, pool } from 'shared-service';

import { PoolClient, QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';
import cityRepository from './city.repository';

class AddressRepository extends GenericRepository<Address>{

    constructor(){
        super('adresses');
    }

    async getById(id: number): Promise<Address | null>{
        return super.getByAttributeEqualTo('id', id.toString(), this.buildAddress);
    }

    async create(address: Address, client?: PoolClient): Promise<Address>{
        return new Promise<Address>((resolve, reject) => {
            const { street, neighbourhood, city, number } = address;
            const query = `
                INSERT INTO adresses(
                    street, 
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
                street.trim(),
                neighbourhood.trim(),
                city.id,
                number
            ];

            const agentQuery = client || pool;

            agentQuery.query(query, values, (error, response) => {
                if(error) reject(error);
                if(response) resolve(this.buildAddress(response.rows[0]));
            });
        });
    }

    private async buildAddress(address: QueryResultRow): Promise<Address>{
        const city = await cityRepository.getById(address?.city_id);

        return new Address(
            address?.id,
            address?.street,
            address?.neighbourhood,
            city!,
            address?.number);
    }

}

export default new AddressRepository();