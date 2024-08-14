import { createAction, props } from '@ngrx/store';
import { Authentication } from '../../interfaces/authentication.interface';

export const authenticate = createAction(
  '[Auth] Authenticate',
  props<Authentication>()
);

export const logout = createAction('[Auth] Logout');
