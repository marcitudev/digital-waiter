export class State{
    id: number;
    acronym: string;
    name: string;

    constructor(
        id: number, 
        acronym: string, 
        name: string
    ){
        this.id = id;
        this.acronym = acronym;
        this.name = name;
    }
}