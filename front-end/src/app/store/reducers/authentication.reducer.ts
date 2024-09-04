import { Action, createReducer, on } from '@ngrx/store';
import { AuthUserState } from '../states';
import * as actions from '../actions';

export const authenticationInitialState: AuthUserState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null
}

const _authenticationReducer = createReducer(authenticationInitialState,
  on(actions.authenticate, (state, { type, ...authUser }) => ({ ...state, ...authUser })
  ),
  on(actions.logout, (state) => ({
      ...state,
      id: null,
      firstName: null,
      lastName: null,
      email: null
    })
  )
);

export function authenticationReducer(state: AuthUserState | undefined, action: Action): AuthUserState {
  return _authenticationReducer(state ?? authenticationInitialState, action);
}
