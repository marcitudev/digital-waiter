import { ErrorEnum } from '../enums/error.enum';
import { Address } from '../models/address.model';
import addressRepository from '../repositories/address.repository';
import cityService from './city.service';

class AddressService{
    
    async create(address: Address): Promise<Address>{
        const existsCityById = await cityService.existsById(address.city?.id);
        if(!existsCityById) throw new Error(ErrorEnum.CITY_NOT_FOUND);

        return addressRepository.create(address);
    }

}

export default new AddressService();