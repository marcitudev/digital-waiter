import { CPFFormat } from '../decorators/cpf.decorator';

export class CPF{

    @CPFFormat()
    cpf: string;

    constructor(cpf: string){
        this.cpf = cpf;
    }

    get value(): string{
        return this.cpf;
    }
}