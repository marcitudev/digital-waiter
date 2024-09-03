import { createAction, props } from '@ngrx/store';
import { AuthUserState } from '../states';

export const authenticate = createAction(
  '[Auth] Authenticate',
  props<AuthUserState>()
);

export const logout = createAction('[Auth] Logout');
