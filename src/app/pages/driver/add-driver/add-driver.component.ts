import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { AddRequest } from '../../../api/Request/AddRequest';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';  // <-- Import Router

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css',
})
export class AddDriverComponent implements OnInit {
  addRequest: AddRequest = new AddRequest();
  addDriverForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _http: RequestSenderService,
    private router: Router  // <-- Inject Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // Auto-populate userName and userHandle when email changes
    this.addDriverForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        this.addDriverForm.patchValue({
          userName: email,
          userHandle: email
        }, { emitEvent: false });
      }
    });
  }

  createForm() {
    this.addDriverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    });
  }

  onSubmit() {
    if (this.addDriverForm.valid) {
      const formValue = this.addDriverForm.getRawValue();
      this.addRequest = {
        ...formValue,
        roles: ['DRIVER'],
      };

      console.log('Final request payload:', this.addRequest);

      this._http
        .sendPostRequest<AdvertisersResponse[]>(Services.REGISTER_DRIVER, this.addRequest)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Driver Added Successfully',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Navigate to driver details page after success popup
              this.router.navigate(['/drivers/details'], {
                queryParams: { username: this.addRequest.userName }
              });
            });
          },
          error: (err) => {
            console.error('Error adding Driver', err);
            Swal.fire({
              icon: 'error',
              title: 'Error Adding Driver',
              text: err?.error?.message || 'An unexpected error occurred.',
            });
          },
        });
    } else {
      console.log('Form is invalid');
      this.addDriverForm.markAllAsTouched();
    }
  }
}
