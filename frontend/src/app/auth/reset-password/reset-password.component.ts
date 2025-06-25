import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  requestForm: FormGroup;
  resetForm: FormGroup;
  
  loading = false;
  error = '';
  success = '';
  token: string | null = null;
  mode: 'request' | 'reset' = 'request';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.mode = 'reset';
    }
  }

  requestReset() {
    if (this.requestForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const email = this.requestForm.value.email;
    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.loading = false;
        // For development: check if a token was returned and redirect
        if (response && response.resetToken) {
          this.router.navigate(['/auth/reset-password', response.resetToken]);
        } else {
          this.success = 'If an account with that email exists, a password reset link has been sent.';
          this.requestForm.reset();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to reset password. The link may be invalid or expired.';
      }
    });
  }

  submitNewPassword() {
    if (this.resetForm.invalid || !this.token) return;

    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Your password has been reset successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to reset password. The link may be invalid or expired.';
      }
    });
  }
}
