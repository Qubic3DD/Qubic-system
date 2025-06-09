// add-fleet-owner.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { AddRequest } from '../../../api/Request/AddRequest';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-fleet-owner',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-fleet-owner.component.html',
  styleUrls: ['./add-fleet-owner.component.css'],
})
export class AddFleetOwnerComponent implements OnInit {
  addRequest: AddRequest = new AddRequest();
  addFleetOwnerForm!: FormGroup;

  constructor(
    private Formbuilder: FormBuilder,
    private _http: RequestSenderService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.addFleetOwnerForm = this.Formbuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
      ],
      companyName: ['', [Validators.required]],
      companyRegistrationNumber: ['', [Validators.required]],
      fleetSize: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.addFleetOwnerForm.valid) {
      const formValue = this.addFleetOwnerForm.getRawValue();
      this.addRequest = {
        ...formValue,
        roles: ['FLEET_OWNER'],
      };

      console.log('Final request payload:', this.addRequest);

      this._http
        .sendPostRequest<AdvertisersResponse[]>(
          Services.REGISTER_FLEET_OWNER,
          this.addRequest
        )
        .subscribe({
          next: (response) => {
            console.log('response', response);
            Swal.fire({
              icon: 'success',
              title: 'Fleet Owner Added Successfully',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.router.navigate(['/fleet-owners']);
            });
          },
          error: (err) => {
            console.error('Error adding Fleet Owner', err);
            Swal.fire({
              icon: 'error',
              title: 'Error Adding Fleet Owner',
              text: err.error.message || 'An error occurred',
            });
          },
        });
    } else {
      console.log('Form is invalid');
      this.addFleetOwnerForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/fleet-owners']);
  }
}