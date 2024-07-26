import { ErrorEnum } from '../enums/error.enum';
import { StatusCode } from '../enums/status-code.enum';
import { ValidationException } from '../exceptions/validation.exception';

function PhoneNumberFormat(msg?: string): PropertyDecorator{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(target: any, propertyKey: string | symbol){
        let value: string = (target as { [key: string]: string })[propertyKey as string];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(newValue !== null && newValue !== undefined && typeof newValue !== 'string'){
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_FORMAT, `${ propertyKey.toString() } is not assignable to ${ typeof newValue }`);
            }

            if(!newValue || !isValidPhoneNumber(newValue)) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_PHONE_NUMBER, msg || `Invalid phone number: ${ propertyKey.toString() }`);
            }

            value = newValue.replace(/\D/g, '');
        }

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }

}

const isValidPhoneNumber = (number: string): boolean => {
    const ddd = number.substring(0,2);
    const phoneNumber = number.substring(2);

    if(ddd.length !== 2 || phoneNumber.length !== 9) return false;

    return isValidDDD(ddd) && isValidNumber(phoneNumber);
}

const isValidDDD = (ddd: string): boolean => {
    const regex = /^\d{2}$/;
    if(!regex.test(ddd)) return false;

    const dddsValidos = [
      11, 12, 13, 14, 15, 16, 17, 18, 19,
      21, 22, 24, 27, 28,
      31, 32, 33, 34, 35, 37, 38,
      41, 42, 43, 44, 45, 46,
      47, 48, 49,
      51, 53, 54, 55,
      61, 62, 63, 64, 65, 66, 67, 68, 69,
      71, 73, 74, 75, 77, 79,
      81, 82, 83, 84, 85, 86, 87, 88, 89,
      91, 92, 93, 94, 95, 96, 97, 98, 99
    ];
    return dddsValidos.includes(parseInt(ddd, 10));
}

const isValidNumber = (number: string): boolean => {
    if(number.length !== 9) throw new Error(ErrorEnum.INVALID_PHONE_NUMBER);
    
    const numberWithoutMask = number.replace(/\D/g, '');
    const regex = /^9\d{8}$/;
    if(!regex.test(numberWithoutMask)) return false;
    return true;
}

export { PhoneNumberFormat }