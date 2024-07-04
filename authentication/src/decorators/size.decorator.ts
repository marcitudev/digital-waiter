import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

function Size(min: number, max: number, msg?: string){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(target: any, propertyKey: string){
        let value: string = target[propertyKey];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(newValue.length < min || newValue.length > max) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_SIZE, msg ? msg : `${target}: Invalid size`);
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

export { Size };