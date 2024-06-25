import { ErrorEnum } from "../enums/error.enum";

export class CPF{
    cpf: string;

    constructor(cpf: string){
        if(!this.isValidCPF(cpf)){
            throw new Error(ErrorEnum.INVALID_CPF);
        }

        this.cpf = cpf.replace(/\D/g, '');
    }
    
    private isValidCPF(cpf: string): boolean{
        const cpfWithoutMask: string = cpf.replace(/\D/g, '');

        if(cpfWithoutMask.length !== 11) return false;
        if(/^(\d)\1*$/.test(cpfWithoutMask)) return false;

        const root = cpfWithoutMask.substring(0, 9);

        const firstDigit = this.calcDigit(root.split(''));
        const secondDigit = this.calcDigit(root.split('').concat(firstDigit.toString()));

        const validCPF = root.concat(firstDigit.toString(), secondDigit.toString());
        return cpfWithoutMask === validCPF;
    }

    private calcDigit(digits: string[]){
        const factor = digits.length + 1;
        const sum = digits.reduce((acc, curr, index) => (parseInt(curr) * (factor - index)) + acc, 0);

        const remainder = sum % 11;

        return remainder < 2 ? 0 : 11 - remainder;
    }

    get value(): string{
        return this.cpf;
    }
}