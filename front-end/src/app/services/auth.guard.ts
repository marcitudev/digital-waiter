import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

export const canMatchTeam: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return inject(AuthGuardService).canMatchTeam();
};
