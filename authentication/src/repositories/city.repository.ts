import { QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';
import { City } from '../models/city.model';
import stateRepository from './state.repository';

class CityRepository extends GenericRepository<City>{

    constructor(){
        super('cities');
    }

    async getById(id: number): Promise<City | null>{
        return this.getByAttributeEqualTo('id', id.toString(), this.buildCity);
    }

    async getByName(name: string): Promise<City | null>{
        return this.getByAttributeEqualTo('name', `'${name}'`, this.buildCity);
    }

    async existsById(id: number): Promise<boolean>{
        return this.existsByAttributeEqualTo('id', id.toString());
    }

    private async buildCity(city: QueryResultRow): Promise<City>{
        const state = await stateRepository.getById(city?.state_id); 

        return new City(
            city?.id,
            city?.name,
            state!);
    }

}

export default new CityRepository();