import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.reducers';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    if (typeof window !== 'undefined') {
      const newState = localStorageSync({
        keys: ['authUser'],
        rehydrate: true,
      })(reducer)(state, action);

      return { ...newState, hydrated: true };
    } else {
      return reducer(state, action);
    }
  };
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
