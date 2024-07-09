import { EmailFormat } from "../decorators/email.decorator";

export class Email{

    @EmailFormat()
    email: string;

    constructor(email: string){
        this.email = email;
    }

    get value(): string{
        return this.email;
    }
}