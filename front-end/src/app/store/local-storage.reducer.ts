import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.reducers';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    if (typeof window !== 'undefined') {
      return localStorageSync({
        keys: ['authUser'],
        rehydrate: true,
      })(reducer)(state, action);
    } else {
      return reducer(state, action);
    }
  };
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
