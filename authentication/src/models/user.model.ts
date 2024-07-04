import { Size } from "../decorators/size.decorator";
import { Status } from "../enums/status.enum";
import { Address } from "./address.model";
import { CPF } from "./cpf.model";
import { Email } from "./email.model";
import { Phone } from "./phone.model";

export class User{
    id: number | null;

    @Size(3, 255, 'Firstname must be between 3 and 255 characteres')
    firstName: string;

    @Size(3, 255, 'Lastname must be between 3 and 255 characteres')
    lastName: string;

    cpf: CPF;
    email: Email;
    phone: Phone;
    address: Address;
    status: Status;
    password: string;

    constructor(
        id: number | null,
        firstName: string,
        lastName: string,
        cpf: string,
        email: string,
        phone: Phone,
        address: Address,
        status: Status,
        password: string
    ){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cpf = new CPF(cpf);
        this.email = new Email(email);
        this.phone = phone;
        this.address = address;
        this.status = status;
        this.password =  password;
    }
}