import { Component, NgModule, OnInit } from '@angular/core';
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
} from '@angular/forms';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-driver',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css',
})
export class AddDriverComponent implements OnInit {
  addRequest: AddRequest = new AddRequest();
  addDriverForm!: FormGroup;

  constructor(
    private Formbuilder: FormBuilder,
    private _http: RequestSenderService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.addDriverForm = this.Formbuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
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
        .sendPostRequest<AdvertisersResponse[]>(
          Services.REGISTER_DRIVER,
          this.addRequest
        )
        .subscribe({
          next: (response) => {
            console.log('response', response);
            Swal.fire({
              icon: 'success',
              title: 'Driver Added Successfully',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (err) => {
            console.error('Error adding Driver', err);
            Swal.fire({
              icon: 'error',
              title: 'Error Adding Advertiser',
              text: err.error.message,
            });
          },
        });
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      this.addDriverForm.markAllAsTouched();
    }
  }
}
