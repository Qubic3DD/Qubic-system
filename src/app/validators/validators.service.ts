import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  public southAfricanIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const idNumber = control.value;
      
      if (!idNumber) {
        return null; // Let required validator handle empty values
      }

      // Basic format validation (13 digits, no letters)
      if (!/^\d{13}$/.test(idNumber)) {
        return { invalidIdFormat: { value: control.value } };
      }

      // Extract date parts
      const year = parseInt(idNumber.substring(0, 2));
      const month = parseInt(idNumber.substring(2, 4));
      const day = parseInt(idNumber.substring(4, 6));

      // Validate date
      const currentYear = new Date().getFullYear() % 100;
      const fullYear = year <= currentYear ? 2000 + year : 1900 + year;
      
      try {
        // This will throw if date is invalid
        const birthDate = new Date(fullYear, month - 1, day);
        
        // Check if the date was adjusted (e.g., Feb 31 becomes Mar 3)
        if (birthDate.getDate() !== day || 
            birthDate.getMonth() !== month - 1 || 
            birthDate.getFullYear() % 100 !== year) {
          return { invalidDate: { value: control.value } };
        }
        
        // Check if date is in the future
        if (birthDate > new Date()) {
          return { futureDate: { value: control.value } };
        }
      } catch {
        return { invalidDate: { value: control.value } };
      }

      // Validate citizenship digit (7th digit)
      const citizenshipDigit = parseInt(idNumber.charAt(10));
      if (citizenshipDigit !== 0 && citizenshipDigit !== 1) {
        return { invalidCitizenship: { value: control.value } };
      }

      // Luhn algorithm check (checksum validation)
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(idNumber.charAt(i));
        const weight = (i % 2 === 0) ? 1 : 2;
        let product = digit * weight;
        sum += (product > 9) ? product - 9 : product;
      }
      const checksum = (10 - (sum % 10)) % 10;
      if (checksum !== parseInt(idNumber.charAt(12))) {
        return { invalidChecksum: { value: control.value } };
      }

      return null; // Valid ID number
    };
  }
}
