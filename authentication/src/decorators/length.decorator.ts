import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

function Length(min: number, max: number, msg?: string){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(target: any, propertyKey: string){
        let value: string = target[propertyKey];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(newValue.length < min || newValue.length > max) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_LENGTH, msg ? msg : `${target}: Invalid length: ${propertyKey}`);
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