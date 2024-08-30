import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { tap, take, filter, Observable, switchMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  hydrated: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.store.select('hydrated').subscribe(hydrated => this.hydrated = hydrated);
  }

  isAuthenticatedForAccessRoute(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (this.hydrated) {
      return this.authService.isAuthenticated().pipe(
        take(1),
        switchMap(authenticated => {
          if (!authenticated && route.url[0].path !== 'login') {
            this.router.navigate(['/login']);
            return of(false);
          } else if(authenticated && route.url[0].path === 'login') {
            this.router.navigate(['/home']);
          }
          return of(true);
        })
      );
    } else {
      return of(false);
    }
  }
}
