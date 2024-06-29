import { City } from "./city.model";

export class Address{
    id: number | null;
    road: string;
    neighbourhood: string;
    city: City;
    number: number | null;

    constructor(
        id: number | null,
        road: string,
        neighbourhood: string,
        city: City,
        number: number | null
    ){
        this.id = id;
        this.road = road;
        this.neighbourhood = neighbourhood;
        this.city = city;
        this.number = number;
    }
}