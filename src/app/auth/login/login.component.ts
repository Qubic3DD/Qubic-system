import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Hardcoded user credentials with more details
  private readonly hardcodedUser = {
    email: 'admin@qubic3d.co.za',
    password: 'admin123',
    firstName: 'Qubic',
    lastName: '3d',
    profilePictureUrl: 'https://avatar-placeholder.iran.liara.run/logo.png' // example URL
  };

  constructor(private router: Router) {}

  onLogin() {
    if (
      this.email === this.hardcodedUser.email &&
      this.password === this.hardcodedUser.password
    ) {
      // Store user session and user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminEmail', this.email);
      localStorage.setItem('firstName', this.hardcodedUser.firstName);
      localStorage.setItem('lastName', this.hardcodedUser.lastName);
      localStorage.setItem('profilePictureUrl', this.hardcodedUser.profilePictureUrl);

      // Navigate to admin dashboard or home page
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }
}
