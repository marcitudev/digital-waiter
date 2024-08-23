// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// NGRX Store
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import * as actions from './../store/actions';
import { AuthenticationState } from '../store/states';

// Utils
import encryptData from '../utils/encrypt.utils';
import { catchError, map, Observable, of, tap } from 'rxjs';
import environment from '../../environments/environment';
import { Authentication } from '../interfaces/authentication.interface';
import { AuthUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authURL = `${environment.servicesURL.authentication}`;
  private _authenticationState: AuthenticationState | null = null;

  constructor(
    private readonly http: HttpClient,
    private store: Store<AppState>
  ) {
    this.store.select('authUser').subscribe((state) => this._authenticationState = state);
  }

  authenticate(email: string, password: string): Observable<Authentication> {
    const encryptedAuthData = encryptData({ email, password });

    return this.http.post<Authentication>(`${this.authURL}authentication`, encryptedAuthData).pipe(
      tap((authentication) => this.setStoreState(authentication))
    );
  }

  refreshToken(): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.authURL}authentication/refresh-token`, { refreshToken: this._authenticationState?.refreshToken }).pipe(
      tap((authentication) => this.setStoreState(authentication))
    );
  }

  logout(): void {
    this.clearStoreTokens();
  }

  isAuthenticated(): Observable<boolean> {
    if(!this._authenticationState || !this._authenticationState.accessToken || !this._authenticationState.refreshToken) {
      this.clearStoreTokens();
      return of(false);
    }

    if(this.verifyTokenExpiration(this._authenticationState!.accessToken!)) return of(true);
    else if(this.verifyTokenExpiration(this._authenticationState!.refreshToken!)) {
      return this.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.clearStoreTokens();
          return of(false);
        })
      );
    };

    this.clearStoreTokens();
    return of(false);
  }

  private verifyTokenExpiration(token: string): boolean {
    const currentDatetime = (new Date().getTime()) / 1000;
    const decodedToken: any = this.decodeToken(token);

    if(!!decodedToken && !!decodedToken.exp) {
      return currentDatetime < decodedToken.exp;
    };

    return false;
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
