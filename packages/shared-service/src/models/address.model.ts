import { NotNull } from '../decorators/not-null.decorator';
import { City } from './city.model';

export class Address{
    id: number | null;
    street: string;
    neighbourhood: string;
    city: City;
    number: number | null;

    constructor(
        id: number | null,
        street: string,
        neighbourhood: string,
        city: City,
        number: number | null
    ){
        this.id = id;
        this.street = street;
        this.neighbourhood = neighbourhood;
        this.city = city;
        this.number = number;
    }
}