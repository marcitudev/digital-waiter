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
  on(actions.authenticate, (state, authUser) => ({ ...authUser })
  ),
  on(actions.logout, (state) => ({
      ...state,
      accessToken: null,
      refreshToken: null,
      authUser: null
    })
  )
);

export function authenticationReducer(state: AuthUserState | undefined, action: Action): AuthUserState {
  return _authenticationReducer(state ?? authenticationInitialState, action);
}
