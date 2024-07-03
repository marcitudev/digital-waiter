import { ErrorEnum } from "../enums/error.enum";
import { StatusCode } from "../enums/status-code.enum";
import { ValidationException } from "../exceptions/validation.exception";

export class Email{
    email: string;

    constructor(email: string){
        if(!this.isValidEmail(email)){
            throw new ValidationException(StatusCode.BAD_REQUEST, ErrorEnum.INVALID_EMAIL, 'Invalid email format');
        }

        this.email = email;
    }
    
    private isValidEmail(email: string): boolean{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get value(): string{
        return this.email;
    }
}