import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

function CPFFormat(msg?: string): PropertyDecorator{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(target: any, propertyKey: string | symbol){
        let value: string = (target as { [key: string]: string })[propertyKey as string];

        const getter = () => value;

        const setter = (newValue: string) => {
            if(newValue && typeof newValue !== 'string'){
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_FORMAT, `${ propertyKey.toString() } is not assignable to ${ typeof newValue }`);
            }

            if(newValue && !isValidCPF(newValue)) {
                throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_CPF, msg || `Invalid CPF: ${ propertyKey.toString() }`);
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

const isValidCPF = (cpf: string): boolean => {
    const cpfWithoutMask: string = cpf.replace(/\D/g, '');

    if(cpfWithoutMask.length !== 11) return false;
    if(/^(\d)\1*$/.test(cpfWithoutMask)) return false;

    const root = cpfWithoutMask.substring(0, 9);

    const firstDigit = calcDigit(root.split(''));
    const secondDigit = calcDigit(root.split('').concat(firstDigit.toString()));

    const validCPF = root.concat(firstDigit.toString(), secondDigit.toString());
    return cpfWithoutMask === validCPF;
}

const calcDigit = (digits: string[]): number => {
    const factor = digits.length + 1;
    const sum = digits.reduce((acc, curr, index) => (parseInt(curr) * (factor - index)) + acc, 0);

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
}

export { CPFFormat };