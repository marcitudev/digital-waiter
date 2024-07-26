// import from shared-service
import { City } from 'shared-service';

import cityRepository from '../repositories/city.repository';

class CityService{

    async getById(id: number): Promise<City | null>{
        return cityRepository.getById(id);
    }

    async existsById(id: number): Promise<boolean>{
        return cityRepository.existsById(id);
    }

}

export default new CityService();