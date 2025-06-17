import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdvertiserService } from "../../../../services/advertiser.service";
import { CampaignService } from "../../../../services/campaign.service";
import { DocumentPurpose } from "../../../../services/document-purpose";
import { FileType } from "../../../../services/file-type";


@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css']
})
export class AddCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  advertisers: any[] = [];
  provinces: any[] = [];
  cities: any[] = [];
  selectedFile: File | null = null;
  isLoading = false;
  loadingAdvertisers = false;
  loadingProvinces = false;
  loadingCities = false;
  formSubmitted = false;
  calculatedPrice = 0;
  pricePer1000 = 1500;
  fileTypes = Object.values(FileType);
  documentPurposes = Object.values(DocumentPurpose);

  constructor(
    private fb: FormBuilder,
    private advertiserService: AdvertiserService,
    private campaignService: CampaignService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private router: Router
  ) {
    this.campaignForm = this.fb.group({
      advertiserId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      requiredImpressions: [1000, [Validators.required, Validators.min(1000)]],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
      mediaFileType: [FileType.VIDEO, Validators.required],
      documentPurpose: [DocumentPurpose.CAMPAIGN_VIDEO, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAdvertisers();
    this.loadProvinces();
    this.campaignForm.get('requiredImpressions')?.valueChanges.subscribe(val => {
      this.calculatePrice(val);
    });
  }

  loadAdvertisers(): void {
    this.loadingAdvertisers = true;
    this.advertiserService.getAllAdvertisers().subscribe(
      (data) => {
        this.advertisers = data;
        this.loadingAdvertisers = false;
      },
      (error) => {
        console.error('Error loading advertisers', error);
        this.loadingAdvertisers = false;
      }
    );
  }

  loadProvinces(): void {
    this.loadingProvinces = true;
    this.provinceService.getAllProvinces().subscribe(
      (data) => {
        this.provinces = data;
        this.loadingProvinces = false;
      },
      (error) => {
        console.error('Error loading provinces', error);
        this.loadingProvinces = false;
      }
    );
  }

  onProvinceChange(provinceId: number): void {
    this.loadingCities = true;
    this.campaignForm.get('cityId')?.reset();
    this.cityService.getCitiesByProvince(provinceId).subscribe(
      (data) => {
        this.cities = data;
        this.loadingCities = false;
      },
      (error) => {
        console.error('Error loading cities', error);
        this.loadingCities = false;
      }
    );
  }

  calculatePrice(impressions: number): void {
    this.calculatedPrice = (impressions / 1000) * this.pricePer1000;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit');
        return;
      }
      this.selectedFile = file;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.campaignForm.invalid || !this.selectedFile) {
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.campaignForm.value.name);
    formData.append('description', this.campaignForm.value.description);
    formData.append('startDate', this.campaignForm.value.startDate);
    formData.append('endDate', this.campaignForm.value.endDate);
    formData.append('requiredImpressions', this.campaignForm.value.requiredImpressions);
    formData.append('advertiserId', this.campaignForm.value.advertiserId);
    formData.append('cityId', this.campaignForm.value.cityId);
    formData.append('provinceId', this.campaignForm.value.provinceId);
    formData.append('price', this.calculatedPrice.toString());
    formData.append('mediaFileType', this.campaignForm.value.mediaFileType);
    formData.append('documentPurpose', this.campaignForm.value.documentPurpose);

    this.campaignService.createCampaign(formData).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/campaigns']);
      },
      (error) => {
        console.error('Error creating campaign', error);
        this.isLoading = false;
      }
    );
  }
}