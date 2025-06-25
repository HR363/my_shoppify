import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          // The service handles redirection
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        }
      });
  }
} 