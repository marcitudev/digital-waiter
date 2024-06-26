import { State } from '../models/state.model';
import { QueryResultRow } from 'pg';
import { GenericRepository } from './generic.repository';

class StateRepository extends GenericRepository<State>{

    table: string = 'states';

    async getById(id: number): Promise<State | null>{
        return this.getByAttributeEqualTo('id', id.toString(), this.buildState);
    }

    async getByAcronym(acronym: string): Promise<State | null>{
        return this.getByAttributeEqualTo('acronym', `'${acronym}'`, this.buildState);
    }

    async getByName(name: string): Promise<State | null>{
        return this.getByAttributeEqualTo('name', `'${name}'`, this.buildState);
    }

    private buildState(state: QueryResultRow): State{
        return new State(
            state?.id,
            state?.acronym,
            state?.name);
    }

}

export default new StateRepository();