import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

function Length(min: number, max: number, canBeNull: boolean = true, msg?: string): PropertyDecorator{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(target: any, propertyKey: string | symbol){
        let value: string = (target as { [key: string]: string })[propertyKey as string];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(newValue !== null && typeof newValue !== 'string'){
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_FORMAT, `${ propertyKey.toString() } is not assignable to ${ typeof newValue }`);
            }

            if(!canBeNull && newValue === null){
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.PROPERTY_CANNOT_BE_NULL, msg || `Property cannot be null: ${ propertyKey.toString() }`);
            }

            if(newValue !== null && (newValue.length < min || newValue.length > max)) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_LENGTH, msg || `Invalid length: ${ propertyKey.toString() }`);
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

export { Length };