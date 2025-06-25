import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService) { }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.authService.requestPasswordReset({ email: this.email })
      .subscribe({
        next: () => {
          this.successMessage = 'If your email exists, a reset link has been sent.';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
        }
      });
  }
} 