export class CPNJ{
    cnpj: string;

    constructor(cnpj: string){
        this.cnpj = cnpj;
    }

    get value(): string{
        return this.cnpj;
    }
}