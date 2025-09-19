import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdvertiserService } from '../../services/advertiser.service';
import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { AdvertisersResponse } from '../../api/Response/AdvertisersResponse';
import { Services } from '../../core/services';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';



type Filter = {
  id: string;
  label: string;
  active: boolean;
};


@Component({
  selector: 'app-advertiser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advertiser.component.html',
  styleUrl: './advertiser.component.css'
})
export class AdvertiserComponent implements OnInit {
    _baseRequest:BaseRequest = new BaseRequest();
    advertisers: AdvertisersResponse[] = [];
    activeFilter: string = 'all';
    // KPI stats
    totalAdvertisers = 0;
    activeAdvertisers = 0; // with at least 1 campaign
    totalBudget = 0; // sum of revenue
    inactiveAdvertisers = 0;
    
    // Modal state
    showAddAdvertiserModal = false;
    isLoading = false;
    addAdvertiserForm: FormGroup;
    newAdvertiser: any = {
      email: '',
      userName: '',
      userHandle: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNo: '',
      companyName: '',
      roles: ['ADVERTISER']
    };

  constructor(
    private router: Router,
    private _http: RequestSenderService, 
    private advertiserService: AdvertiserService,
    private formBuilder: FormBuilder
  ) {
    this.addAdvertiserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      companyName: [''],
      agencyEmail: ['', [Validators.email]]
    });
  }

 
ngOnInit(): void {
  this.getAdvertisers();
  this.setupFormListeners();
}

setupFormListeners(): void {
  // Auto-fill userName and userHandle when email changes
  this.addAdvertiserForm.get('email')?.valueChanges.subscribe(email => {
    if (email) {
      this.addAdvertiserForm.patchValue({
        userName: email,
        userHandle: email
      }, { emitEvent: false });
    }
  });

  // Auto-update fullName when firstName or lastName changes
  const firstNameControl = this.addAdvertiserForm.get('firstName');
  const lastNameControl = this.addAdvertiserForm.get('lastName');

  firstNameControl?.valueChanges.subscribe(() => this.updateFullName());
  lastNameControl?.valueChanges.subscribe(() => this.updateFullName());
}

private updateFullName(): void {
  const firstName = this.addAdvertiserForm.get('firstName')?.value || '';
  const lastName = this.addAdvertiserForm.get('lastName')?.value || '';
  const fullName = `${firstName} ${lastName}`.trim();
  // Note: fullName is auto-generated, not stored in form
}

 
///get advertisers
getAdvertisers() {
  this._http.sendGetRequest<any>(Services.GET_ADVERTISERS, this._baseRequest).subscribe({
    next: (response) => {
      this.advertisers = response.data; 
      this.updateStats();
    },
    error: (err) => {
      console.error("Error fetching advertisers", err);
    }
  });
}

  private updateStats(): void {
    const all = this.advertisers || [];
    this.totalAdvertisers = all.length;
    this.activeAdvertisers = all.filter(a => (a.activeCampaigns || 0) > 0).length;
    this.inactiveAdvertisers = Math.max(0, this.totalAdvertisers - this.activeAdvertisers);
    this.totalBudget = all.reduce((sum: number, a: any) => sum + (Number(a.revenue) || 0), 0);
  }
  addAdvertiser() {
    this.openAddAdvertiserModal();
  }

  // Modal methods
  openAddAdvertiserModal(): void {
    this.showAddAdvertiserModal = true;
  }

  closeAddAdvertiserModal(): void {
    this.showAddAdvertiserModal = false;
    this.addAdvertiserForm.reset();
    this.newAdvertiser = {
      email: '',
      userName: '',
      userHandle: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      companyName: '',
      agencyEmail: '',
      roles: ['ADVERTISER']
    };
  }

  onSubmitAdvertiser(): void {
    if (this.addAdvertiserForm.valid) {
      this.isLoading = true;
      const formValue = this.addAdvertiserForm.getRawValue();
      const addRequest = {
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        password: formValue.password,
        phoneNumber: formValue.phoneNumber,
        companyName: formValue.companyName,
        agencyEmail: formValue.agencyEmail
      };

      this._http.sendPostRequest<AdvertisersResponse[]>(Services.REGISTER_ADVERTISER, addRequest).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Advertiser Added Successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getAdvertisers(); // Refresh the list
            this.closeAddAdvertiserModal();
            this.isLoading = false;
          });
        },
        error: (err) => {
          console.error('Error adding advertiser:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error Adding Advertiser',
            text: err?.error?.message || 'An unexpected error occurred.',
          });
          this.isLoading = false;
        }
      });
    } else {
      this.addAdvertiserForm.markAllAsTouched();
    }
  }
  editAdvertiser(userName: string) {
    this.router.navigate(['/advertisers/edit'], { queryParams: { username: userName } });
  }

  deleteAdvertiser(userName: string) {
    if (!confirm('Delete this advertiser?')) return;
    this.advertiserService.deleteAdvertiser(userName).subscribe({
      next: () => {
        // Refresh list from server to ensure consistency
        this.getAdvertisers();
      },
      error: (err) => {
        console.error('Failed to delete advertiser', err);
      }
    });
  }


viewFleetOwnerDetails(userName: string): void {
  this.router.navigate(['/advertisers/details'], {
    queryParams: { username: userName },
  });
}
  toggleFilter(filterId: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    }));
    this.activeFilter = filterId;
  }
  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
    { id: 'pending', label: 'Pending', active: false }
  ];

  getDocumentUrlByUsernameAndPurpose(
    username: string,
    purpose: string
  ): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    // PRODUCTION BACKEND (commented out for local testing)
    // return `https://backend.qubic3d.co.za/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
    
    // LOCAL BACKEND (for testing)
    return `http://localhost:8181/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }
    getInitials(name: string): string {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}
imageLoadFailed: { [email: string]: boolean } = {};

onImageError(email: string) {
  this.imageLoadFailed[email] = true;
}
}
