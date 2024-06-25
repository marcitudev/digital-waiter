import { ErrorEnum } from "../enums/error.enum";

export class Email{
    email: string;

    constructor(email: string){
        if(!this.isValidEmail(email)){
            throw new Error(ErrorEnum.INVALID_EMAIL);
        }

        this.email = email;
    }
    
    private isValidEmail(email: string): boolean{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}