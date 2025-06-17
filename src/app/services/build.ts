// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// // In your component
// buildForm(): FormGroup {
//   return this.fb.group({
//     // Basic Information
//     email: ['', [Validators.required, Validators.email]],
//     profile: [''],
//     IDNo: [''],
//     phoneNo: ['', Validators.required],
//     username: [''],
//     userHandle: [''],
//     roles: this.fb.array([]),
//     type: [''],

//     // Personal Information
//     firstName: ['', Validators.required],
//     lastName: ['', Validators.required],
//     gender: [''],
//     idNumber: [''],
//     licenseType: [''],
//     dateOfBirth: [''],

//     // Location Information
//     address: [''],
//     city: [''],
//     postalCode: [''],
//     country: [''],
//     location: [''],

//     // Business Information
//     serviceInformation: [''],
//     companyName: [''],
//     isCompany: [false],
//     companyRegistrationNumber: [''],
//     taxNumber: [''],
//     companyType: [''],
//     vatRegistered: [false],
//     website: [''],
//     fleetCount: [0],
//     coverageAreas: this.fb.array([]),
//     servicesOffered: this.fb.array([]),
//     operatingHours: [''],

//     // Contact Information
//     contactPerson: [''],
//     contactTitle: [''],
//     supportContact: [''],

//     // Profile Information
//     disability: [''],
//     bio: [''],
//     languages: this.fb.array([]),
//     logo: [''],
//     businessLicenseUrl: [''],
//     socialLinks: [''],

//     // Vehicle Information
//     vehicleInformation: this.fb.array([]),
//     availableVehicleTypes: this.fb.array([]),
//     preferredOperatingAreas: this.fb.array([]),

//     // Subscription
//     subscriptionPlan: [''],
//     subscriptionExpiry: ['']
//   });
// }

// // Helper methods for dynamic form arrays
// addVehicleInformation(): void {
//   const vehicleForm = this.fb.group({
//     capacity: [''],
//     colour: [''],
//     licenseRegistrationNo: [''],
//     isPublic: [false],
//     creationDate: [''],
//     transportType: [''],
//     vehicleType: [''],
//     userInformationId: [null]
//   });
//   (this.form.get('vehicleInformation') as FormArray).push(vehicleForm);
// }

// addCoverageArea(): void {
//   (this.form.get('coverageAreas') as FormArray).push(this.fb.control(''));
// }