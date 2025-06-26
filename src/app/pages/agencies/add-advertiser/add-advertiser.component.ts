import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRequest } from '../../../api/Request/base-request';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { AddRequest } from '../../../api/Request/AddRequest';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-add-advertiser',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-advertiser.component.html',
  styleUrl: './add-advertiser.component.css'
})
export class AddAgenciesComponent implements OnInit {

  _baseRequest: BaseRequest = new BaseRequest();
  user: AdvertisersResponse[] = [];
  addRequest: AddRequest = new AddRequest();
  addAdvertiserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _http: RequestSenderService,
    private router: Router  // Inject Router here
  ) {
    this.addAdvertiserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      fullName: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    // Auto-populate userName and userHandle when email changes
    this.addAdvertiserForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        this.addAdvertiserForm.patchValue({
          userName: email,
          userHandle: email
        }, { emitEvent: false });
      }
    });

    // Auto-populate fullName when firstName or lastName changes
    this.addAdvertiserForm.get('firstName')?.valueChanges.subscribe(() => this.updateFullName());
    this.addAdvertiserForm.get('lastName')?.valueChanges.subscribe(() => this.updateFullName());
  }

  private updateFullName(): void {
    const firstName = this.addAdvertiserForm.get('firstName')?.value || '';
    const lastName = this.addAdvertiserForm.get('lastName')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim();

    this.addAdvertiserForm.patchValue({ fullName }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.addAdvertiserForm.valid) {
      const formValue = this.addAdvertiserForm.getRawValue();
      this.addRequest = {
        ...formValue,
        roles: ['AGENCY']
      };

      console.log("Final request payload:", this.addRequest);

      this._http.sendPostRequest<AdvertisersResponse[]>(Services.REGISTER_ADVERTISER, this.addRequest).subscribe({
        next: (response) => {
          console.log("response", response);
          Swal.fire({
            icon: 'success',
            title: 'Agency Added Successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            // Navigate to details after success alert closes
            this.router.navigate(['/advertisers/details'], {
              queryParams: { username: this.addRequest.userName }
            });
          });
        },
        error: (err) => {
          console.error("Error adding agency", err);
          Swal.fire({
            icon: 'error',
            title: 'Error Adding Agency',
            text: err?.error?.message || 'An unexpected error occurred.',
          });
        }
      });
    } else {
      console.log("Form is invalid");
      this.addAdvertiserForm.markAllAsTouched();
    }
  }
}
