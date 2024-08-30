import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.reducers';
import Cookies from 'js-cookie';

export function cookieSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    if (typeof window !== 'undefined') {
      let newState = reducer(state, action);

      const { accessToken, refreshToken, authUser } = newState.authUser;
      if(accessToken && refreshToken && authUser) {
        Cookies.set('authUser', JSON.stringify(newState.authUser), { expires: 7 });
      }

      const cookieAuthUser = Cookies.get('authUser');
      if (cookieAuthUser) {
        newState = { ...newState, authUser: JSON.parse(cookieAuthUser) };
      }

      return { ...newState, hydrated: true };
    } else {
      return reducer(state, action);
    }
  };
}

export const metaReducers: MetaReducer<AppState>[] = [cookieSyncReducer];
