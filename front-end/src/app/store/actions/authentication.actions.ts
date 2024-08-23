import { createAction, props } from '@ngrx/store';
import { AuthenticationState } from '../states';

export const authenticate = createAction(
  '[Auth] Authenticate',
  props<AuthenticationState>()
);

export const logout = createAction('[Auth] Logout');
