import { QueryResultRow } from 'pg';
import { Address } from '../models/address.model';
import { GenericRepository } from './generic.repository';
import cityRepository from './city.repository';

class AddressRepository extends GenericRepository<Address>{

    table: string = 'adresses';

    async getById(id: number): Promise<Address | null>{
        return this.getByAttributeEqualTo('id', id.toString(), this.buildAddress);
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