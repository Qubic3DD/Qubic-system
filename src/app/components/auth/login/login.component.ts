import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  loginEmail: string = '';
  password: string = '';
  errorMessage: string = '';
  loginSuccess: boolean = false;
  isLoading: boolean = false;
  rememberMe: boolean = false;

  // Hardcoded admin credentials
  private readonly ADMIN_EMAIL = 'admin@qubic3d.co.za';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor(private router: Router) {
    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginEmail = rememberedEmail;
      this.rememberMe = true;
    }
  }

  onLogin() {
    // Basic validation
    if (!this.loginEmail) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.loginSuccess = false;

    // Simulate API call delay
    setTimeout(() => {
      this.checkCredentials();
    }, 1000);
  }

  private checkCredentials() {
    // Check against hardcoded credentials
    if (this.loginEmail === this.ADMIN_EMAIL && this.password === this.ADMIN_PASSWORD) {
      this.handleSuccessfulLogin();
    } else {
      this.handleFailedLogin();
    }
    this.isLoading = false;
  }

  private handleSuccessfulLogin() {
    this.loginSuccess = true;
    
    // Store remember me preference
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.loginEmail);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Store session information
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userEmail', this.loginEmail);

    // Navigate to admin dashboard after a brief delay
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  private handleFailedLogin() {
    this.errorMessage = 'Invalid email or password. Please try again.';
    this.password = ''; // Clear password field for security
  }
}