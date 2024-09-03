import { ActionReducerMap } from '@ngrx/store';
import * as states from './states';
import * as reducers from './reducers';

export interface AppState {
  authUser: states.AuthUserState;
  hydrated: boolean;
}

export const appReducers: ActionReducerMap<AppState> = {
  authUser: reducers.authenticationReducer,
  hydrated: (state: boolean = false) => (state)
}
