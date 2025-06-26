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
import { Router } from '@angular/router';  // <-- import Router

@Component({
  selector: 'app-add-advertiser',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-advertiser.component.html',
  styleUrl: './add-advertiser.component.css'
})
export class AddAdminComponent implements OnInit {

  _baseRequest: BaseRequest = new BaseRequest();
  user: AdvertisersResponse[] = [];
  addRequest: AddRequest = new AddRequest();
  addAdvertiserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _http: RequestSenderService,
    private router: Router  // <-- inject Router here
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
    this.addAdvertiserForm.get('email')?.valueChanges.subscribe(emailValue => {
      if (emailValue) {
        this.addAdvertiserForm.patchValue({
          userName: emailValue,
          userHandle: emailValue
        }, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.addAdvertiserForm.valid) {
      const formValue = this.addAdvertiserForm.getRawValue();
      this.addRequest = {
        ...formValue,
        roles: ['ADMIN']
      };

      console.log("Final request payload:", this.addRequest);

      this._http.sendPostRequest<AdvertisersResponse[]>(Services.REGISTER_ADVERTISER, this.addRequest).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Admin Added Successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/admins/details'], {
              queryParams: { username: this.addRequest.userName }
            });
          });
        },
        error: (err) => {
          console.error("Error adding admin", err);
          Swal.fire({
            icon: 'error',
            title: 'Error Adding Admin',
            text: err?.error?.message || 'Unknown error occurred.',
          });
        }
      });
    } else {
      console.log("Form is invalid");
      this.addAdvertiserForm.markAllAsTouched();
    }
  }
}
