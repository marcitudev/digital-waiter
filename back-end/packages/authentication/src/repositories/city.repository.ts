// import from shared-service
import { City } from 'shared-service';

import { QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';
import stateRepository from './state.repository';

class CityRepository extends GenericRepository<City>{

    constructor(){
        super('cities');
    }

    async getAll(): Promise<Array<City>>{
        return super.getAll(this.buildCity);
    }

    async getById(id: number): Promise<City | null>{
        return super.getByAttributeEqualTo('id', id.toString(), this.buildCity);
    }

    async getByName(name: string): Promise<City | null>{
        return super.getByAttributeEqualTo('name', `'${name}'`, this.buildCity);
    }

    async existsById(id: number): Promise<boolean>{
        return super.existsByAttributeEqualTo('id', id);
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