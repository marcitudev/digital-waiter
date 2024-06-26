import { ErrorEnum } from "../enums/error.enum";

export class Phone{
    id: number | null;
    number: string;

    constructor(id: number | null, number: string) {
        if(!this.isValidPhoneNumber(number)) throw new Error(ErrorEnum.INVALID_PHONE_NUMBER);

        this.id = id;
        this.number = number.replace(/\D/g, '');
    }

    private isValidPhoneNumber(number: string): boolean {
        const ddd = number.substring(0,2);
        const phoneNumber = number.substring(2);

        return this.isValidDDD(ddd) && this.isValidNumber(phoneNumber);
    }

    private isValidDDD(ddd: string){
        const regex = /^\d{2}$/;
        if(!regex.test(ddd)) return false;

        const dddsValidos = [
          11, 12, 13, 14, 15, 16, 17, 18, 19,
          21, 22, 24, 27, 28,
          31, 32, 33, 34, 35, 37, 38,
          41, 42, 43, 44, 45, 46,
          47, 48, 49,
          51, 53, 54, 55,
          61, 62, 63, 64, 65, 66, 67, 68, 69,
          71, 73, 74, 75, 77, 79,
          81, 82, 83, 84, 85, 86, 87, 88, 89,
          91, 92, 93, 94, 95, 96, 97, 98, 99
        ];
        return dddsValidos.includes(parseInt(ddd, 10));
    }

    private isValidNumber(number: string): boolean {
        const numberWithoutMask = number.replace(/\D/g, '');
        const regex = /^9\d{8}$/;
        if(!regex.test(numberWithoutMask)) return false;
        return true;
    }

    get value(): string{
        return this.number;
    }

}