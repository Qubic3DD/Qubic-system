import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-driver',
    imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent implements OnInit {
      @Input() isCollapsed = false;
  userEmail: string | null = null;
  userName: string | null = null;

  addDriverForm!: FormGroup;
  fleetOwnerEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private _http: RequestSenderService,
    private route: ActivatedRoute
  ) {    // Get user info from localStorage when component initializes
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    // Get fleet owner email from query parameters
    this.route.queryParams.subscribe(params => {
      this.fleetOwnerEmail = params['username'];
      console.log('Fleet Owner Email:', this.fleetOwnerEmail);
    });

    this.createForm();
  }

  createForm() {
    this.addDriverForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      userHandle: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.addDriverForm.valid) {
      const formValue = this.addDriverForm.value;
      const requestPayload = {
        ...formValue,
        roles: ['DRIVER'],
        fleetOwnerEmail: this.userEmail
      };

      console.log('Final request payload:', requestPayload);

      this._http.sendPostRequest(Services.REGISTER_DRIVER, requestPayload)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Driver Added Successfully',
              showConfirmButton: false,
              timer: 1500,
            });
            // Optionally reset form or navigate away
            this.addDriverForm.reset();
          },
          error: (err) => {
            console.error('Error adding Driver', err);
            Swal.fire({
              icon: 'error',
              title: 'Error Adding Driver',
              text: err.error?.message || 'An error occurred',
            });
          },
        });
    } else {
      this.addDriverForm.markAllAsTouched();
    }
  }
}