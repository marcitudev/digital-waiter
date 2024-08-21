import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { tap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canMatchTeam() {
    return this.authService.isAuthenticated().pipe(
      tap(state => {
        if (!state) {
          this.router.navigate(['/login']);
        }
      }),
      take(1)
    );
  }
}
