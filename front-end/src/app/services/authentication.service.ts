// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// NGRX Store
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import * as actions from './../store/actions';

// Interfaces
import { AuthenticationStatus } from '../interfaces/authentication.status.interface';
import { AuthUser } from '../interfaces/user.interface';

// Utils
import encryptData from '../utils/encrypt.utils';
import { Observable, of, switchMap, tap } from 'rxjs';
import environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authURL = `${environment.servicesURL.authentication}`;

  constructor(
    private readonly http: HttpClient,
    private store: Store<AppState>
  ) {}

  authenticate(email: string, password: string): Observable<AuthUser> {
    const encryptedAuthData = encryptData({ email, password });

    return this.http.post<AuthUser>(`${this.authURL}authentication`, encryptedAuthData, { withCredentials: true }).pipe(
      tap((authUser) => this.setStoreState(authUser))
    );
  }

  refreshToken(): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.authURL}authentication/refresh-token`, {}).pipe(
      tap((authUser) => this.setStoreState(authUser))
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.post<AuthenticationStatus>(`${this.authURL}authentication/is-authenticated`, {}, { withCredentials: true }).pipe(
      switchMap(authenticationStatus => {
        const { isAuthenticated } = authenticationStatus;
        if(!isAuthenticated) this.clearStoreTokens();

        return of(isAuthenticated);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authURL}authentication/revoke-authentication`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearStoreTokens())
    );
  }

  private setStoreState(authUser: AuthUser): void {
    this.store.dispatch(actions.authenticate(authUser));
  }

  private clearStoreTokens(): void {
    this.store.dispatch(actions.logout());
  }

}
