import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Role, ROLE_CONFIGS } from '../../services/role.enum';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.component.html',
  styleUrls: ['./login.component.component.css'],
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

  fetchApplication() {
    if (!this.email) {
      this.errorMessage = 'Please enter an email address';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const apiUrl = 'https://backend.qubic3d.co.za/api/applications/by-email/';
    
    this.http.get(`${apiUrl}?email=${encodeURIComponent(this.email)}`).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.data) {
          this.applicationData = this.transformApplicationData(response.data);
        } else {
          this.errorMessage = 'No application found for this email';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to fetch application. Please try again later.';
        console.error('Error fetching application:', error);
      }
    });
  }

  private transformApplicationData(data: any): any {
    return {
      ...data,
      fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Not provided',
      applicationDate: data.applicationDate ? new Date(data.applicationDate) : new Date(),
      status: data.status || 'Pending'
    };
  }

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  downloadDocuments() {
    if (!this.applicationData?.documentsUrl) {
      this.errorMessage = 'No documents available for download';
      return;
    }

    this.isLoading = true;
    const link = document.createElement('a');
    link.href = this.applicationData.documentsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    this.isLoading = false;
  }

  processApplication() {
    if (!this.applicationData) {
      this.errorMessage = 'No application selected';
      return;
    }

    this.isLoading = true;
    
    // In a real app, you would call an API endpoint here
    setTimeout(() => {
      this.isLoading = false;
      this.applicationData.status = 'Processed';
      
      // Show success message
      this.errorMessage = '';
      setTimeout(() => {
        this.applicationData = null;
        this.email = '';
      }, 2000);
    }, 1500);
  }

  onLogin() {
    if (!this.selectedRole) {
      this.errorMessage = 'Please select a portal type';
      return;
    }

    const roleConfig = ROLE_CONFIGS[this.selectedRole];
    
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (roleConfig.requiresPassword && !this.password) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // In a real app, you would call your authentication API here
    setTimeout(() => {
      this.authenticateUser();
    }, 1000);
  }

  private authenticateUser() {
    this.isLoading = false;
    
    // Demo authentication logic - replace with real API call
    const isAdmin = this.email === 'admin@qubic3d.co.za' && this.password === 'admin123';
    const isValidLogin = isAdmin || 
                       (this.email.endsWith('@qubic3d.co.za') && this.password === 'demo123');
    
    if (isValidLogin) {
      this.handleSuccessfulLogin(isAdmin);
    } else {
      this.handleFailedLogin();
    }
  }

  private handleSuccessfulLogin(isAdmin: boolean) {
    this.userFirstName = isAdmin ? 'Admin' : this.email.split('@')[0];
    this.loginSuccess = true;
    
    // Store user session
    this.storeUserSession();
    
    // Remember credentials if requested
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email);
      localStorage.setItem('rememberedRole', this.selectedRole!);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedRole');
    }
    
    // Redirect after delay
    setTimeout(() => {
      this.router.navigate([ROLE_CONFIGS[this.selectedRole!].route]);
    }, 2500);
  }
getRoleLabel(role: Role): string {
  return ROLE_CONFIGS[role]?.label || role;
}


  private handleFailedLogin() {
    this.errorMessage = 'Invalid credentials for selected portal';
    this.password = '';
  }

  private storeUserSession() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', this.selectedRole!);
    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('userName', this.userFirstName);
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