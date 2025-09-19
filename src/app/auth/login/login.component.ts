import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Role, ROLE_CONFIGS } from '../../services/role.enum copy';
import { environmentApplication } from '../../environments/environment';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  // Separate email fields for each flow
  loginEmail: string = '';
  applyEmail: string = '';
  trackingEmail: string = '';
  
  password: string = '';
  errorMessage: string = '';
  loginSuccess: boolean = false;
  isLoading: boolean = false;
  selectedRole: Role | null = null;
  userFirstName: string = '';
  rememberMe: boolean = false;
  activeFlow: 'login' | 'apply' | 'track' | null = null;

  // Filter out applicant role for login since they should apply first
  loginRoles = Object.values(Role).filter(role => role !== Role.APPLICANT);
  applyRoles = Object.values(Role); // All roles available for application

  constructor(private router: Router, private http: HttpClient) {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedRole = localStorage.getItem('rememberedRole') as Role;
    
    if (rememberedEmail && rememberedRole) {
      this.loginEmail = rememberedEmail;
      this.selectedRole = rememberedRole;
      this.rememberMe = true;
      this.activeFlow = 'login';
    }
  }

  getRoleConfig(role: Role) {
    return ROLE_CONFIGS[role];
  }
onTrackApplication() {
  if (!this.trackingEmail) {
    this.errorMessage = 'Please enter your email address';
    return;
  }

  if (!this.isValidEmail(this.trackingEmail)) {
    this.errorMessage = 'Please enter a valid email address';
    return;
  }

  this.isLoading = true;

  this.checkExistingApplication2(this.trackingEmail).then(exists => {
    this.isLoading = false;

    if (exists) {
      this.router.navigate(['/application-dashboard-track', this.trackingEmail]);
    } else {
      this.errorMessage = 'No application found with this email address. Would you like to start a new application instead?';
    }
  }).catch(error => {
    this.isLoading = false;
    this.errorMessage = 'Failed to track application. Please try again.';
    console.error('Tracking error:', error);
  });
}

private async checkExistingApplication2(email: string): Promise<boolean> {
  if (!email) return false;

  try {
    const response = await this.http.get<any>(
      `${environmentApplication.api}applications/by-email?email=${encodeURIComponent(email)}`
    ).toPromise();

    return response?.length > 0;
  } catch (error) {
    console.error('Error checking existing application:', error);
    return false;
  }
}


  selectFlow(flow: 'login' | 'apply' | 'track') {
    this.activeFlow = flow;
    this.errorMessage = '';
    this.selectedRole = null;
  }

  selectRole(role: Role) {
    this.selectedRole = role;
    this.errorMessage = '';
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

    if (!this.loginEmail) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.loginEmail)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Live:
    // this.http.post('https://backend.qubic3d.co.za/api/login/simple', {
    // Local:
    this.http.post('http://localhost:8181/api/login/simple', {
      email: this.loginEmail,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.data) {
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

  onApply() {
    if (!this.selectedRole) {
      this.errorMessage = 'Please select an application type';
      return;
    }

    if (!this.applyEmail) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.applyEmail)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    
    this.checkExistingApplication(this.applyEmail).then(exists => {
      this.isLoading = false;
      
      if (exists) {
          this.router.navigate(['/application-dashboard-track', this.applyEmail]);
      } else {
        this.router.navigate(['/application-dashboard'], { 
          queryParams: { 
            email: this.applyEmail, 
            role: this.selectedRole,
            flow: 'new'
          } 
        });
      }
    }).catch(error => {
      this.isLoading = false;
      this.errorMessage = 'Failed to check existing applications. Please try again.';
    });
  }

private async checkExistingApplication(email: string): Promise<boolean> {
  if (!email) return false;
  
  try {
    const response = await this.http.get<any>(
      `${environmentApplication.api}applications/by-email?email=${encodeURIComponent(email)}`
    ).toPromise();

    return response?.length > 0;
  } catch (error) {
    console.error('Error checking existing application:', error);
    return false;
  }
}


  private fetchProfile(email: string) {
    // Live:
    // this.http.get(`https://backend.qubic3d.co.za/profile/retrieve/${encodeURIComponent(email)}`)
    // Local:
    this.http.get(`http://localhost:8181/profile/retrieve/${encodeURIComponent(email)}`)
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
    const userRoles = profileData.roles || [];
    
    if (userRoles.includes(this.selectedRole)) {
      this.handleSuccessfulLogin(profileData);
    } else {
      this.isLoading = false;
      this.errorMessage = `You don't have access to the ${this.getRoleLabel(this.selectedRole!)} portal.`;
      if (confirm('Would you like to apply for this role instead?')) {
        this.activeFlow = 'apply';
        // Copy the login email to apply email for convenience
        this.applyEmail = this.loginEmail;
      }
    }
  }

  private handleSuccessfulLogin(profileData: any) {
    this.userFirstName = profileData.firstName || profileData.email.split('@')[0];
    this.loginSuccess = true;
    
    this.storeUserSession(profileData);
    
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.loginEmail);
      localStorage.setItem('rememberedRole', this.selectedRole!);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedRole');
    }
    
    setTimeout(() => {
      const roleConfig = ROLE_CONFIGS[this.selectedRole!];
      this.router.navigate([roleConfig?.route || '/']);
    }, 1500);
  }

  getRoleLabel(role: Role): string {
    return ROLE_CONFIGS[role]?.label || role;
  }

  private storeUserSession(profileData: any) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', this.selectedRole!);
    localStorage.setItem('userEmail', this.loginEmail);
    localStorage.setItem('userName', this.userFirstName);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    localStorage.setItem('userId', profileData.id);
    sessionStorage.setItem('sessionToken', this.generateSessionToken());
  }

  private generateSessionToken(): string {
    return 'token-' + Math.random().toString(36).substr(2, 16) + '-' + Date.now().toString(36);
  }
}