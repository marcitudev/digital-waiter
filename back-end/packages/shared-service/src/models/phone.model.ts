import { PhoneNumberFormat } from '../decorators/phone-number.decorator';

export class Phone{
    id: number | null;

    @PhoneNumberFormat()
    number: string;

    constructor(id: number | null, number: string) {
        this.id = id;
        this.number = number;
    }

    get value(): string{
        return this.number;
    }

}