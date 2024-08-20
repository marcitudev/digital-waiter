import { Action, createReducer, on } from '@ngrx/store';
import { AuthenticationState } from '../states';
import * as actions from '../actions';

export const authenticationInitialState: AuthenticationState = {
  accessToken: null,
  refreshToken: null,
  authUser: null
}

const _authenticationReducer = createReducer(authenticationInitialState,
  on(actions.authenticate, (state, { accessToken, refreshToken, authUser }) => (
    {
      ...state,
      accessToken: accessToken,
      refreshToken: refreshToken,
      authUser: authUser
    })
  ),
  on(actions.logout, (state) => ({
      ...state,
      accessToken: null,
      refreshToken: null,
      authUser: null
    })
  )
);

export function authenticationReducer(state: AuthenticationState | undefined, action: Action): AuthenticationState {
  return _authenticationReducer(state ?? authenticationInitialState, action);
}
