import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormsModule, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestSenderService } from '../../../core/request-sender.service';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
// import { GetUserRequest } from '../../../api/Request/getUserRequest';
import { Services } from '../../../core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-advertiser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-advertiser.component.html',
  styleUrl: './edit-advertiser.component.css'
})
export class EditAdvertiserComponent implements OnInit {

  _GetUserRequest: GetUserRequest = new GetUserRequest();
  currentStep = 1;
  newLanguage = '';
  advertiser: AdvertisersResponse | null = null;
  username: any
  advertiserForm!: FormGroup;
  constructor(private _http: RequestSenderService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] ? params['username'] : null;
      if (this.username) {
        this.getAdvertiser(this.username);
      }
    });
  }

  getAdvertiser(username: string) {
    const requestParams = { username };
    this._http.sendGetRequest<any>(
      Services.GET_ADVERTISER_BY_USERNAME,
      requestParams,
      true
    ).subscribe({
      next: (response) => {
        this.advertiser = response.data;
        // Patch the form with the advertiser data
        this.advertiserForm.patchValue({
          firstName: this.advertiser?.firstName,
          lastName: this.advertiser?.lastName,

        });

        // Add languages if they exist
        if (this.advertiser?.languages) {
          this.advertiser.languages.forEach(lang => {
            this.languages.push(new FormControl(lang));
          });
        }
      },
      error: (err) => {
        console.error("Error fetching advertiser", err);
      }
    });
  }
   createForm() {
    this.advertiserForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', Validators.required],
      idNumber: ['', [Validators.required, this.southAfricanIdValidator()]],
      licenseType: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.dateValidator()]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      country: ['South Africa', Validators.required],
      languages: this.fb.array(['English']),
      serviceInformation: ['', Validators.maxLength(500)],
      companyName: ['', Validators.maxLength(100)],
      website: ['', Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      disability: [''],
      bio: ['', Validators.maxLength(1000)],
      
      // Vehicle Information
      vehicleInformation: this.fb.group({
        capacity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        colour: ['', [Validators.required, Validators.maxLength(30)]],
        licenseRegistrationNo: ['', [Validators.required, Validators.maxLength(20)]],
        transportType: ['TAXI', Validators.required],
        vehicleType: ['HATCH', Validators.required],
        public: [false]
      })
    });
  }

  // South African ID Validator
  southAfricanIdValidator(): ValidatorFn {
    return (control: import('@angular/forms').AbstractControl): { [key: string]: any } | null => {
      const idNumber = control.value;
      
      if (!idNumber) return null;

      // Basic format validation
      if (!/^\d{13}$/.test(idNumber)) {
        return { invalidIdFormat: true };
      }

      // Date validation
      const year = parseInt(idNumber.substring(0, 2));
      const month = parseInt(idNumber.substring(2, 4));
      const day = parseInt(idNumber.substring(4, 6));
      
      // Determine century (1900s or 2000s)
      const currentYear = new Date().getFullYear() % 100;
      const fullYear = year <= currentYear ? 2000 + year : 1900 + year;
      
      // Validate date
      const birthDate = new Date(fullYear, month - 1, day);
      if (birthDate.getDate() !== day || 
          birthDate.getMonth() !== month - 1 || 
          birthDate.getFullYear() % 100 !== year) {
        return { invalidDate: true };
      }

      // Validate citizenship digit (7th digit)
      const citizenshipDigit = parseInt(idNumber.charAt(10));
      if (citizenshipDigit !== 0 && citizenshipDigit !== 1) {
        return { invalidCitizenship: true };
      }

      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(idNumber.charAt(i));
        const weight = (i % 2 === 0) ? 1 : 2;
        let product = digit * weight;
        sum += (product > 9) ? product - 9 : product;
      }
      const checksum = (10 - (sum % 10)) % 10;
      if (checksum !== parseInt(idNumber.charAt(12))) {
        return { invalidChecksum: true };
      }

      return null;
    };
  }

  // Date Validator (not in future)
  dateValidator(): ValidatorFn {
    return (control: import('@angular/forms').AbstractControl): { [key: string]: any } | null => {
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today ? { futureDate: true } : null;
    };
  }

  // Getter for languages FormArray
  get languages() {
    return this.advertiserForm.get('languages') as FormArray;
  }

  // Getter for vehicle information FormGroup
  get vehicleInfo() {
    return this.advertiserForm.get('vehicleInformation') as FormGroup;
  }


  //Add languages
  addLanguage() {
    if (this.newLanguage && this.newLanguage.trim() !== '') {
      this.languages.push(new FormControl(this.newLanguage.trim()));
      this.newLanguage = '';
    }
  }

  //remove languages
  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }



  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.advertiserForm.valid) {
      const formData = this.advertiserForm.value;
      console.log('Form data to submit:', formData);
      this._http.sendPostRequest(
        Services.UPDATE_ADVERTISER,
        formData
      ).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Advertiser updated successfully!'
          });
          console.log("Advertiser updated successfully", response);
          this.navigateToAdvertisers()
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update advertiser. Please try again.'
          });
          console.error("Error updating advertiser", err);
        }
      });
    } else {
      this.markFormGroupTouched(this.advertiserForm);
    }
  }



  navigateToAdvertisers() {
    this.router.navigate(['/advertisers']);
  }
}
export class GetUserRequest {
  username: string | undefined;
  includeLanguages?: boolean;
  includeVehicleInfo?: boolean;

  constructor(init?: Partial<GetUserRequest>) {
    Object.assign(this, init);
  }
}
