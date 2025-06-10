import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseRequest } from '../../../api/Request/base-request';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { AddRequest } from '../../../api/Request/AddRequest';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RequestSenderService } from '../../../core/request-sender.service';
import { Services } from '../../../core/services';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';




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




  constructor(private Formbuilder: FormBuilder, private _http: RequestSenderService) {

    this.addAdvertiserForm = this.Formbuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
      fullName: [{ value: '', disabled: true }]
    });


  }


  ngOnInit(): void {

  }



 onSubmit() {
  if (this.addAdvertiserForm.valid) {
    const formValue = this.addAdvertiserForm.getRawValue();
    this.addRequest = {
      ...formValue,
      roles: ['ADMIN'] 
    };

    console.log("Final request payload:", this.addRequest);
    
    this._http.sendPostRequest<AdvertisersResponse[]>(Services.REGISTER_ADVERTISER, this.addRequest).subscribe({
      next: (response) => {
        console.log("response", response);
        Swal.fire({
          icon: 'success',
          title: 'Advertiser Added Successfully',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        console.error("Error adding advertiser", err);
        Swal.fire({
          icon: 'error',
          title: 'Error Adding Advertiser',
          text: err.error.message,
        });
      }
    });
  } else {
    console.log("Form is invalid");
    // Mark all fields as touched to show validation errors
    this.addAdvertiserForm.markAllAsTouched();
  }
}

}
