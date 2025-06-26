import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestSenderService } from '../../../core/request-sender.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponentFleet implements OnInit {
  @Input() isCollapsed = false;
  userEmail: string | null = null;
  showPassword = false; // Added this property
  isLoading = false;

  addDriverForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _http: RequestSenderService,
    private route: ActivatedRoute,
   private router: Router // Add Router to constructor
  ) {
    this.userEmail = localStorage.getItem('userEmail');
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.addDriverForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

  onSubmit() {
    if (this.addDriverForm.invalid || this.isLoading) {
      this.addDriverForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    const requestPayload = {
      ...this.addDriverForm.value,
      fleetOwnerEmail: this.userEmail
    };

    this._http.sendPostRequest('api/fleet-owners/add-driver', requestPayload)
       .subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Driver Added Successfully',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.viewDrivers(); // Navigate after Swal closes
        });
      },
      error: (err) => {
          this.isLoading = false;
          console.error('Error adding Driver', err);
          let errorMessage = 'An error occurred while adding the driver';
          
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your connection.';
          } else if (err.status === 400) {
            errorMessage = 'Invalid request data. Please check the form fields.';
          } else if (err.status === 409) {
            errorMessage = 'A driver with this email already exists.';
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error Adding Driver',
            text: errorMessage,
          });
        },
      });
  }
    viewDrivers(): void {
  this.router.navigate(['/fleet-owner-dashboard/drivers'], {
    queryParams: { username: this.userEmail },
  });
}
  // Helper methods for form validation in template
  get firstName() { return this.addDriverForm.get('firstName'); }
  get lastName() { return this.addDriverForm.get('lastName'); }
  get email() { return this.addDriverForm.get('email'); }
  get password() { return this.addDriverForm.get('password'); }
  get phoneNumber() { return this.addDriverForm.get('phoneNumber'); }
}