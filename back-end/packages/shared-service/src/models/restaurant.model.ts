import { Length } from "../decorators/length.decorator";
import { NotNull } from "../decorators/not-null.decorator";
import { Status } from "../enums/status.enum";
import { Address } from "./address.model";
import { CPNJ } from "./cnpj.model";
import { Phone } from "./phone.model";
import { User } from "./user.model";

export class Restaurant {
    id: number | null;

    @Length(3, 255, false)
    name: string;

    createdAt: Date | null;
    cnpj: CPNJ;
    
    @NotNull()
    phone: Phone;

    @NotNull()
    address: Address;

    owner: User;
    status: Status;

    constructor(
        id: number | null, 
        name: string, 
        createdAt: Date | null, 
        cnpj: string, 
        phone: Phone, 
        address: Address, 
        owner: User,
        status: Status
    ){
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.cnpj = new CPNJ(cnpj);
        this.phone = phone;
        this.address = address;
        this.owner = owner;
        this.status = status;
    }

}