import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router
  ){ }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }

}
