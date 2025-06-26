import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseRequest } from '../../../api/Request/base-request';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { AddRequest } from '../../../api/Request/AddRequest';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';  // <-- import Router

@Component({
  selector: 'app-add-advertiser',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-advertiser.component.html',
  styleUrl: './add-advertiser.component.css'
})
export class AddPassengerComponent implements OnInit {

  _baseRequest: BaseRequest = new BaseRequest();
  user: AdvertisersResponse[] = [];
  addRequest: AddRequest = new AddRequest();
  addAdvertiserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _http: RequestSenderService,
    private router: Router  // <-- inject Router
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
    this.addAdvertiserForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        this.addAdvertiserForm.patchValue({
          userName: email,
          userHandle: email
        }, { emitEvent: false });
      }
    });

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
        roles: ['PASSENGER']
      };

      this._http.sendPostRequest<AdvertisersResponse[]>(Services.REGISTER_ADVERTISER, this.addRequest).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Passenger Added Successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/passenger/details'], {
              queryParams: { username: this.addRequest.userName }
            });
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Adding Passenger',
            text: err?.error?.message || 'An unexpected error occurred.',
          });
        }
      });
    } else {
      this.addAdvertiserForm.markAllAsTouched();
    }
  }
}
