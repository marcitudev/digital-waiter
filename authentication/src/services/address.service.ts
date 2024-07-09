import { PoolClient } from 'pg';
import { ErrorEnum } from '../enums/error.enum';
import { StatusCode } from '../enums/status-code.enum';
import { ValidationException } from '../exceptions/validation.exception';
import { Address } from '../models/address.model';
import addressRepository from '../repositories/address.repository';
import cityService from './city.service';

class AddressService{
    
    async create(address: Address, client?: PoolClient): Promise<Address>{
        await this.createValidation(address);

        return addressRepository.create(address, client);
    }

    private async createValidation(address: Address){
        const { road, neighbourhood, city } = address;

        if(!road) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_ROAD, 'Invalid road');
        if(!neighbourhood) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_NEIGHBOURHOOD, 'Invalid neighbourhood');
        if(!city?.id) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_CITY, 'Invalid city');

        const existsCityById = await cityService.existsById(address.city.id);
        if(!existsCityById) throw new ValidationException(StatusCode.NOT_FOUND, ErrorEnum.CITY_NOT_FOUND, 'City not found');
    }

}

export default new AddressService();