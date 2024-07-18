import { State } from './state.model';

export class City{
    id: number;
    name: string;
    state: State;

    constructor(
        id: number,
        name: string,
        state: State,
    ){
        this.id = id;
        this.name = name;
        this.state = state;
    }
}