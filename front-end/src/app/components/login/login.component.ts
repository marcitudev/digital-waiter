// Angular
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// Fontawesome Icons
import { faLock, faAt } from '@fortawesome/free-solid-svg-icons';

// Services
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  faLock = faLock;
  faAt = faAt;

  formLogin = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loading: boolean = false;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly formBuilder: FormBuilder
  ) { }

  login(event: Event): void{
    event.preventDefault();

    if(this.formLogin.invalid) return;

    this.loading = true;

    const { email, password } = this.formLogin.value;

    if(email && password) {
      this.authService.authenticate(email, password).subscribe({
        next: () => this.loading = false,
        error: () => this.loading = false
      });
    }
  }

  greetByTimeOfDay(): string {
    const currentTime = new Date().getHours();

    if (currentTime >= 6 && currentTime < 12) {
      return 'good morning!';
    } else if (currentTime >= 12 && currentTime < 18) {
      return 'good afternoon!';
    } else {
      return 'good evening!';
    }
  }

}
