import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseRequest } from '../../../api/Request/base-request';
import { RequestSenderService } from '../../../core/request-sender.service';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { Services } from '../../../core/services';


type Document = {
  name: string;
  fileType: string;
  filePath: string;
  documentPurpose: string;
  file?: File;
};

type VehicleInformation = {
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  transportType: string;
  vehicleType: string;
  public: boolean;
};


@Component({
  selector: 'app-edit-advertiser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-advertiser.component.html',
  styleUrl: './edit-advertiser.component.css'
})
export class EditAdvertiserComponent {
  currentStep = 1;
  newLanguage = '';

  constructor(private _http: RequestSenderService, private _baseRequest:BaseRequest) {}



  
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





  onSubmit() {
    

  }
}
