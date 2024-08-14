// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// NGRX Store
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import * as actions from './../store/actions';

// Utils
import encryptData from '../utils/encrypt.utils';
import { Observable, tap } from 'rxjs';
import environment from '../../environments/environment';
import { Authentication } from '../interfaces/authentication.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authURL = `${environment.servicesURL.authentication}`;

  constructor(
    private readonly http: HttpClient,
    private store: Store<AppState>
  ) { }

  authenticate(email: string, password: string): Observable<Authentication> {
    const encryptedAuthData = encryptData({ email, password });

    return this.http.post<Authentication>(`${this.authURL}authentication`, encryptedAuthData).pipe(
      tap((authentication) => this.setStoreTokens(authentication))
    );
  }

  logout(): void {
    this.clearStoreTokens();
  }

  private setStoreTokens(authentication: Authentication): void {
    this.store.dispatch(actions.authenticate(authentication));
  }

  private clearStoreTokens(): void {
    this.store.dispatch(actions.logout());
  }
}
