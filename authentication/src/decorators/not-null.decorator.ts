import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

function NotNull(msg?: string): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function(target: Object, propertyKey: string | symbol){
        let value: string = (target as { [key: string]: string })[propertyKey as string];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(!newValue) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.PROPERTY_CANNOT_BE_NULL, msg || `Property cannot be null: ${ propertyKey.toString() }`);
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

export { NotNull };