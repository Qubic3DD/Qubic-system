import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvertiserService } from '../../../../services/advertiser.service';
import { CampaignService } from '../../../../services/campaign.service';
import { DocumentPurpose } from '../../../../services/document-purpose';
import { FileType } from '../../../../services/file-type';
import { CityService } from '../../../../services/city.service';
import { ProvinceService } from '../../../../services/profile.service';
import { Advertiser } from '../../../../model/adverrtiser.model';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from './file-size.pipe';
import { forkJoin } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  imports: [FormsModule, CommonModule, FileSizePipe, ReactiveFormsModule, NgSelectModule],
  standalone: true,
})
export class AddCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  advertisers: Advertiser[] = [];
  provinces: any[] = [];
  cities: any[] = [];
  allCities: any[] = []; // Store all cities for filtering
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
  loggedInAdvertiserEmail: string | null = null;
  showProvinceDropdown = false;
showCityDropdown = false;
provinceSearch = '';
citySearch = '';
filteredProvinces: Province[] = [];
filteredCities: City[] = [];
selectedProvinces: number[] = [];
selectedCities: number[] = [];

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
      provinceId: [[], Validators.required],
      cityId: [[], Validators.required],
      mediaFileType: [FileType.VIDEO, Validators.required],
      documentPurpose: [DocumentPurpose.CAMPAIGN_VIDEO, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAdvertisers();
    this.loadAllProvinces();
    this.loadAllCities(); // Load all cities upfront
    this.filteredProvinces = [...this.provinces];
this.filteredCities = [...this.cities];
    this.campaignForm.get('requiredImpressions')?.valueChanges.subscribe(val => {
      this.calculatePrice(val);
    });

    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserId) {
      this.campaignForm.get('advertiserId')?.setValue(storedUserId);
    }
    this.loggedInAdvertiserEmail = storedUserEmail;

    // Watch for province changes to filter cities
    this.campaignForm.get('provinceId')?.valueChanges.subscribe(provinceIds => {
      this.filterCitiesByProvinces(provinceIds);
    });
  }

  loadAdvertisers(): void {
    this.loadingAdvertisers = true;
    this.advertiserService.getAllAdvertisers().subscribe({
      next: (response) => {
        this.advertisers = response.data;
        this.loadingAdvertisers = false;
      },
      error: (error) => {
        console.error('Error loading advertisers', error);
        this.loadingAdvertisers = false;
      }
    });
  }
toggleProvinceDropdown(): void {
  this.showProvinceDropdown = !this.showProvinceDropdown;
  if (this.showProvinceDropdown) {
    this.showCityDropdown = false;
  }
}

toggleCityDropdown(): void {
  this.showCityDropdown = !this.showCityDropdown;
  if (this.showCityDropdown) {
    this.showProvinceDropdown = false;
  }
}

filterProvinces(): void {
  if (!this.provinceSearch) {
    this.filteredProvinces = [...this.provinces];
    return;
  }
  this.filteredProvinces = this.provinces.filter(province =>
    province.name.toLowerCase().includes(this.provinceSearch.toLowerCase())
  );
}

filterCities(): void {
  if (!this.citySearch) {
    this.filteredCities = this.getCitiesForSelectedProvinces();
    return;
  }
  this.filteredCities = this.getCitiesForSelectedProvinces().filter(city =>
    city.name.toLowerCase().includes(this.citySearch.toLowerCase())
  );
}

getCitiesForSelectedProvinces(): City[] {
  return this.allCities.filter(city => 
    this.selectedProvinces.includes(city.province.id)
  );
}

isProvinceSelected(provinceId: number): boolean {
  return this.selectedProvinces.includes(provinceId);
}

isCitySelected(cityId: number): boolean {
  return this.selectedCities.includes(cityId);
}

toggleProvinceSelection(provinceId: number): void {
  if (this.isProvinceSelected(provinceId)) {
    this.selectedProvinces = this.selectedProvinces.filter(id => id !== provinceId);
    // Remove cities from deselected province
    this.selectedCities = this.selectedCities.filter(cityId => {
      const city = this.allCities.find(c => c.id === cityId);
      return city?.province.id !== provinceId;
    });
  } else {
    this.selectedProvinces = [...this.selectedProvinces, provinceId];
  }
  this.filteredCities = this.getCitiesForSelectedProvinces();
  this.updateFormValues();
}

toggleCitySelection(cityId: number): void {
  if (this.isCitySelected(cityId)) {
    this.selectedCities = this.selectedCities.filter(id => id !== cityId);
  } else {
    this.selectedCities = [...this.selectedCities, cityId];
  }
  this.updateFormValues();
}

getSelectedProvinceLabels(): string {
  if (this.selectedProvinces.length === 0) return '';
  if (this.selectedProvinces.length === this.provinces.length) return 'All provinces selected';
  if (this.selectedProvinces.length > 3) return `${this.selectedProvinces.length} provinces selected`;
  
  return this.selectedProvinces
    .map(id => this.provinces.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join(', ');
}

getSelectedCityLabels(): string {
  if (this.selectedCities.length === 0) return '';
  if (this.selectedCities.length > 3) return `${this.selectedCities.length} cities selected`;
  
  return this.selectedCities
    .map(id => {
      const city = this.allCities.find(c => c.id === id);
      return city ? `${city.name} (${city.province.name})` : '';
    })
    .filter(Boolean)
    .join(', ');
}

getProvinceName(provinceId: number): string {
  return this.provinces.find(p => p.id === provinceId)?.name || '';
}

updateFormValues(): void {
  this.campaignForm.patchValue({
    provinceId: this.selectedProvinces,
    cityId: this.selectedCities
  });
}

// Close dropdowns when clicking outside

  loadAllProvinces(): void {
    this.loadingProvinces = true;
    this.provinceService.getAllProvinces().subscribe(
      (data) => {
        this.provinces = data.data;
        this.loadingProvinces = false;
      },
      (error) => {
        console.error('Error loading provinces', error);
        this.loadingProvinces = false;
      }
    );
  }

  loadAllCities(): void {
    this.loadingCities = true;
    this.cityService.getAllCities().subscribe(
      (data) => {
        this.allCities = data.data;
        this.loadingCities = false;
      },
      (error) => {
        console.error('Error loading cities', error);
        this.loadingCities = false;
      }
    );
  }

  filterCitiesByProvinces(provinceIds: number[]): void {
    if (!provinceIds || provinceIds.length === 0) {
      this.cities = [];
      this.campaignForm.get('cityId')?.setValue([]);
      return;
    }

    this.cities = this.allCities.filter(city => 
      provinceIds.includes(city.province.id)
    );
  }

  calculatePrice(impressions: number): void {
    this.calculatedPrice = (impressions / 1000) * this.pricePer1000;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
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
    formData.append('advertiserId', localStorage.getItem('userId')!);
    
    // Append each city ID separately
    this.campaignForm.value.cityId.forEach((cityId: number) => {
      formData.append('cityId', cityId.toString());
    });
    
    // Append each province ID separately
    this.campaignForm.value.provinceId.forEach((provinceId: number) => {
      formData.append('provinceId', provinceId.toString());
    });
    
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

  @HostListener('document:click', ['$event'])
onClickOutside(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    this.showProvinceDropdown = false;
    this.showCityDropdown = false;
  }
}
}

export interface City {
  id: number;
  name: string;
  province: Province;
}

export interface Province {
  id: number;
  name: string;
}

