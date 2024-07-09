import { PoolClient } from 'pg';
import { ErrorEnum } from '../enums/error.enum';
import { StatusCode } from '../enums/status-code.enum';
import { ValidationException } from '../exceptions/validation.exception';
import { Phone } from '../models/phone.model';
import phoneRepository from '../repositories/phone.repository';

class PhoneService{
    
    async create(phone: Phone, client?: PoolClient): Promise<Phone>{
        const ddd = phone.number.substring(0,2);
        const number = phone.number.substring(2);

        const existsByDDDAndNumber = await phoneRepository.existsByDDDAndPhoneNumber(ddd, number);
        if(existsByDDDAndNumber) throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.PHONE_NUMBER_ALREADY_EXISTS, 'Phone number already exists');

        return phoneRepository.create(ddd, number, client);
    }

}

export default new PhoneService();