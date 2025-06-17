import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Role, ROLE_CONFIGS } from '../../services/role.enum';

@Component({
  selector: 'login-component',
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
  isLoading: boolean = false;
  selectedRole: Role | null = null;
  applicationData: any = null;
  userFirstName: string = '';
  rememberMe: boolean = false;

  // Available roles from the enum
  roles = Object.values(Role);

  constructor(private router: Router, private http: HttpClient) {
    // Check for remembered credentials
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedRole = localStorage.getItem('rememberedRole') as Role;
    
    if (rememberedEmail && rememberedRole) {
      this.email = rememberedEmail;
      this.selectedRole = rememberedRole;
      this.rememberMe = true;
    }
  }

  getRoleConfig(role: Role) {
    return ROLE_CONFIGS[role];
  }

  selectRole(role: Role) {
    this.selectedRole = role;
    this.errorMessage = '';
    this.applicationData = null;
  }

  navigateToDashboard() {
    this.router.navigate(['/application-dashboard']);
  }

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  onLogin() {
    if (!this.selectedRole) {
      this.errorMessage = 'Please select a portal type';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Call the login API
    this.http.post('http://192.168.8.100:8443/api/login/simple', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.data) {
          // After successful login, fetch the profile to verify roles
          this.fetchProfile(response.data.email);
        } else {
          this.isLoading = false;
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  private fetchProfile(email: string) {
    this.http.get(`http://localhost:8443/profile/retrieve/${encodeURIComponent(email)}`)
      .subscribe({
        next: (profileResponse: any) => {
          this.isLoading = false;
          if (profileResponse.data) {
            this.verifyRoleAndLogin(profileResponse.data);
          } else {
            this.errorMessage = 'Failed to fetch user profile';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to fetch profile';
        }
      });
  }

  private verifyRoleAndLogin(profileData: any) {
    // Extract roles from profile data (adjust according to your API response structure)
    const userRoles = profileData.roles || [];
    
    // Check if the selected role matches any of the user's roles
    if (userRoles.includes(this.selectedRole)) {
      this.handleSuccessfulLogin(profileData);
    } else {
      this.isLoading = false;
      this.errorMessage = `You don't have access to the ${this.getRoleLabel(this.selectedRole!)} portal.`;
    }
  }

  private handleSuccessfulLogin(profileData: any) {
    this.userFirstName = profileData.firstName || profileData.email.split('@')[0];
    this.loginSuccess = true;
    
    // Store user session
    this.storeUserSession(profileData);
    
    // Remember credentials if requested
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email);
      localStorage.setItem('rememberedRole', this.selectedRole!);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedRole');
    }
    
    // Redirect based on role after a short delay
    setTimeout(() => {
      const roleConfig = ROLE_CONFIGS[this.selectedRole!];
      if (roleConfig?.route) {
        this.router.navigate([roleConfig.route]);
      } else {
        console.error('No route defined for role:', this.selectedRole);
        this.router.navigate(['/']); // Fallback navigation
      }
    }, 1500);
  }

  getRoleLabel(role: Role): string {
    return ROLE_CONFIGS[role]?.label || role;
  }

  private storeUserSession(profileData: any) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', this.selectedRole!);
    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('userName', this.userFirstName);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    sessionStorage.setItem('sessionToken', this.generateSessionToken());
  }

  private generateSessionToken(): string {
    return 'token-' + Math.random().toString(36).substr(2, 16) + 
           '-' + Date.now().toString(36);
  }

  forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address first';
      return;
    }

    this.isLoading = true;
    
    // In a real app, you would call your password reset API here
    setTimeout(() => {
      this.isLoading = false;
      this.errorMessage = '';
      alert(`Password reset instructions sent to ${this.email}`);
    }, 1500);
  }
}