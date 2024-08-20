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
import { AuthUser } from '../interfaces/user.interface';

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
      tap((authentication) => this.setStoreState(authentication))
    );
  }

  logout(): void {
    this.clearStoreTokens();
  }

  private setStoreState(authentication: Authentication): void {
    const authenticationData = {
      ...authentication,
      authUser: this.decodeToken(authentication.accessToken)
    }
    this.store.dispatch(actions.authenticate(authenticationData));
  }

  private clearStoreTokens(): void {
    this.store.dispatch(actions.logout());
  }

  private decodeToken(token: string): AuthUser | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const uff8Payload = decodeURIComponent(
        Array.prototype.map
        .call(decodedPayload, (c: string) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''));
      return JSON.parse(uff8Payload);
    } catch(error) {
      return null;
    }
  }
}
