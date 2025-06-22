import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environmentApplication } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'AppForgotPasswordComponent',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app-forgot-password.component.html',
  styleUrls: ['./app-forgot-password.component.css']
})
export class AppForgotPasswordComponent implements OnDestroy {
  currentStep: 'email' | 'otp' | 'newPassword' | 'success' = 'email';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email = '';
  otpExpiryTime = 0; // in seconds
  otpCountdown = 0;
  private countdownSubscription?: Subscription;

  // Forms
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  startCountdown(expiryInSeconds: number = 3600) {
    this.otpExpiryTime = expiryInSeconds;
    this.otpCountdown = expiryInSeconds;
    this.stopCountdown();
    
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.otpCountdown--;
      if (this.otpCountdown <= 0) {
        this.stopCountdown();
      }
    });
  }

  stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = undefined;
    }
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.otpCountdown / 60);
    const seconds = this.otpCountdown % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  requestResetOtp() {
    if (this.emailForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.email = this.emailForm.value.email;

    this.http.post(`${environmentApplication.api}password/reset/request`, { email: this.email })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.currentStep = 'otp';
          this.startCountdown(); // Start 1 hour countdown
          this.successMessage = 'OTP sent to your email. Valid for 1 hour.';
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to send OTP. Please try again.';
        }
      });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post(`${environmentApplication.api}otp/verify`, {
      email: this.email,
      otp: this.otpForm.value.otp
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 'newPassword';
        this.stopCountdown();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }

  resetPassword() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.email,
      otp: this.otpForm.value.otp,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };

    this.http.post(`${environmentApplication.api}password/reset/confirm`, payload)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Password reset successfully!';
          this.currentStep = 'success';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to reset password. Please try again.';
          // If OTP expired, go back to email step
          if (err.error?.message?.toLowerCase().includes('expired')) {
            this.currentStep = 'email';
          }
        }
      });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  resendOtp() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post(`${environmentApplication.api}otp/resend`, { email: this.email })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.startCountdown(); // Reset countdown
          this.successMessage = 'New OTP sent to your email. Valid for 1 hour.';
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to resend OTP. Please try again.';
        }
      });
  }
}