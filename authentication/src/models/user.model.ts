import { Status } from "../enums/status.enum";
import { Address } from "./address.model";
import { CPF } from "./cpf.model";
import { Email } from "./email.model";
import { Phone } from "./phone.model";

export class User{
    id: number | null;
    firstName: string;
    lastName: string;
    cpf: CPF;
    email: Email;
    password: string;
    phone: Phone;
    address: Address;
    status: Status;

    constructor(
        id: number | null,
        firstName: string,
        lastName: string,
        cpf: string,
        email: string,
        password: string,
        phone: string,
        address: Address,
        status: Status
    ){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cpf = new CPF(cpf);
        this.email = new Email(email);
        this.password =  password;
        this.phone = new Phone(phone);
        this.address = address;
        this.status = status;
    }
}