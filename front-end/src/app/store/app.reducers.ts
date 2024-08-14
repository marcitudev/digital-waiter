import { ActionReducerMap } from '@ngrx/store';
import * as states from './states';
import * as reducers from './reducers';

export interface AppState {
  authUser: states.AuthenticationState;
}

export const appReducers: ActionReducerMap<AppState> = {
  authUser: reducers.authenticationReducer
}
