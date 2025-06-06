import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loginSuccess: boolean = false;

  // Hardcoded user credentials with more details
  private readonly hardcodedUser = {
    email: 'admin@qubic3d.co.za',
    password: 'admin123',
    firstName: 'Qubic',
    lastName: '3d',
    profilePictureUrl: 'https://avatar-placeholder.iran.liara.run/logo.png', // example URL
  };

  constructor(private router: Router) {}

  onLogin() {
    // Trim inputs to remove accidental whitespace
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (
      trimmedEmail === this.hardcodedUser.email &&
      trimmedPassword === this.hardcodedUser.password
    ) {
      // Store user session and user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminEmail', trimmedEmail);
      localStorage.setItem('firstName', this.hardcodedUser.firstName);
      localStorage.setItem('lastName', this.hardcodedUser.lastName);
      localStorage.setItem(
        'profilePictureUrl',
        this.hardcodedUser.profilePictureUrl
      );

      this.loginSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
      this.errorMessage = ''; // Clear any previous error message
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }
}
