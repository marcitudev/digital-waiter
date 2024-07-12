import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

function EmailFormat(msg?: string): PropertyDecorator{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(target: any, propertyKey: string | symbol){
        let value: string = (target as { [key: string]: string })[propertyKey as string];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(newValue !== null && newValue !== undefined && typeof newValue !== 'string'){
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_FORMAT, `${ propertyKey.toString() } is not assignable to ${ typeof newValue }`);
            }

            if(!newValue || !isValidEmail(newValue)) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_EMAIL, msg || `Invalid email: ${ newValue }`);
            }

            value = newValue;
        }

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export { EmailFormat };