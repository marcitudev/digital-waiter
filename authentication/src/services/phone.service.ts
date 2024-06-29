import { Phone } from '../models/phone.model';
import phoneRepository from '../repositories/phone.repository';

class PhoneService{
    
    async create(phone: Phone): Promise<Phone>{
        const ddd = phone.number.substring(0,2);
        const number = phone.number.substring(2);

        return phoneRepository.create(ddd, number);
    }

}

export default new PhoneService();