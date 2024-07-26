import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import encryptData from '../utils/encrypt.utils';
import environment from '../../environments/environment';
import { Authentication } from '../interfaces/authentication.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authURL = `${environment.servicesURL.authentication}`; // Replace with your actual API endpoint

  constructor(
    private readonly http: HttpClient
  ) { }

  authenticate(email: string, password: string): Observable<Authentication> {
    const encryptedAuthData = encryptData({ email, password });

    return this.http.post<Authentication>(`${this.authURL}/authentication`, encryptedAuthData).pipe(
      tap(this.setStoreTokens)
    );
  }

  private setStoreTokens(authentication: Authentication): void {
    const { accessToken, refreshToken } = authentication;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
}
