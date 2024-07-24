// import from shared-service
import { Address, ErrorEnum, StatusCode, ValidationException } from 'shared-service';

import { PoolClient } from 'pg';
import addressRepository from '../repositories/address.repository';
import cityService from './city.service';


class AddressService{
    
    async create(address: Address, client?: PoolClient): Promise<Address>{
        await this.createValidation(address);

        return addressRepository.create(address, client);
    }

    private async createValidation(address: Address){
        const { street, neighbourhood, city } = address;

        if(!street) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_STREET, 'Invalid street');
        if(!neighbourhood) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_NEIGHBOURHOOD, 'Invalid neighbourhood');
        if(!city?.id) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_CITY, 'Invalid city');

        const existsCityById = await cityService.existsById(address.city.id);
        if(!existsCityById) throw new ValidationException(StatusCode.NOT_FOUND, ErrorEnum.CITY_NOT_FOUND, 'City not found');
    }

}

export default new AddressService();