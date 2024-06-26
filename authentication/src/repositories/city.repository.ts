import { QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';
import { City } from '../models/city.model';
import stateRepository from './state.repository';

class StateRepository extends GenericRepository<City>{

    table: string = 'cities';

    async getById(id: number): Promise<City | null>{
        return this.getByAttributeEqualTo('id', id.toString(), this.buildCity);
    }

    async getByName(name: string): Promise<City | null>{
        return this.getByAttributeEqualTo('name', `'${name}'`, this.buildCity);
    }

    private async buildCity(city: QueryResultRow): Promise<City>{
        const state = await stateRepository.getById(city?.state_id); 

        return new City(
            city?.id,
            city?.name,
            state!);
    }

}

export default new StateRepository();