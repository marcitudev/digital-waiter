import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { take } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  return inject(AuthGuardService).isAuthenticatedForAccessRoute(route);
};
