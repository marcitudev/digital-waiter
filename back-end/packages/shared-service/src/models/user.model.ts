import { Length } from '../decorators/length.decorator';
import { NotNull } from '../decorators/not-null.decorator';
import { Status } from '../enums/status.enum';
import { Address } from './address.model';
import { CPF } from './cpf.model';
import { Email } from './email.model';
import { Phone } from './phone.model';

export class User{
    id: number | null;

    @Length(3, 255, false, 'Firstname must be between 3 and 255 characteres')
    firstName: string;

    @Length(3, 255, false, 'Lastname must be between 3 and 255 characteres')
    lastName: string;

    cpf: CPF;

    email: Email;

    @NotNull()
    phone: Phone;

    @NotNull()
    address: Address;
    
    status: Status;

    @Length(6, 30, false, 'Password must be between 6 and 30 characteres')
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static transformAnInstanceIntoAUser(userInstance: { [key: string]: any }): User{
        const { id, firstName, lastName, cpf, email, phone, address, status, password } = userInstance;
        const phoneEntity = new Phone(null, phone);

        return new User(id, firstName, lastName, cpf, email, phoneEntity, address, status, password);
    }
}