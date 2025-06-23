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
import { AdvertiserProviderService } from '../../../../services/advertiser-provider.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  imports: [FormsModule, CommonModule, FileSizePipe, ReactiveFormsModule],
  standalone: true,
})
export class AddCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  advertisers: Advertiser[] = [];
  provinces: Province[] = [];
  allCities: City[] = []; // Store all cities for filtering
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

  // Dropdown controls
  showProvinceDropdown = false;
  showCityDropdown = false;
  provinceSearch = '';
  citySearch = '';
  filteredProvinces: Province[] = [];
  filteredCities: City[] = [];
  selectedProvinces: number[] = [];
  selectedCities: number[] = [];
videoDimensions: {width: number, height: number} | null = null;
  constructor(
    private fb: FormBuilder,
    private advertiserService: AdvertiserService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private advertiserProvider: AdvertiserProviderService,
    private campaignService: CampaignService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.campaignForm = this.fb.group({
      advertiserId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      requiredImpressions: [1000, [Validators.required, Validators.min(1000)]],
      provinceId: [[]], // Made optional by removing Validators.required
      cityId: [[]],     // Made optional by removing Validators.required
      mediaFileType: [FileType.VIDEO, Validators.required],
      documentPurpose: [DocumentPurpose.CAMPAIGN_VIDEO, Validators.required]
    });
  }



  ngOnInit(): void {
    this.loadAdvertisers();
    this.loadAllProvinces();
    this.loadAllCities();
    this.loadingAdvertisers = true;

    this.advertiserProvider
      .loadAdvertisers()
      .pipe(finalize(() => (this.loadingAdvertisers = false)))
      .subscribe();

    this.advertiserProvider.advertisers$.subscribe({
      next: (data) => {
        this.advertisers = data;
      },
      error: (err) => {
        console.error('Error fetching advertisers from stream:', err);
        this.snackBar.open('Failed to load advertisers', 'Close', {
          duration: 3000,
        });
      },
    });
    this.campaignForm.get('requiredImpressions')?.valueChanges.subscribe(val => {
      this.calculatePrice(val);
    });

    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserId) {
      this.campaignForm.get('advertiserId')?.setValue(storedUserId);
    }
    this.loggedInAdvertiserEmail = storedUserEmail;
  }

  loadAdvertisers(): void {
    this.loadingAdvertisers = true;

    this.advertiserProvider
      .loadAdvertisers()
      .pipe(
        finalize(() => {
          this.loadingAdvertisers = false;
        })
      )
      .subscribe({
        next: () => {
          this.advertiserProvider.advertisers$.subscribe((data) => {
            this.advertisers = data;
          });
        },
        error: (err) => {
          console.error('Error loading advertisers:', err);
          this.snackBar.open('Failed to load advertisers', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  // Load all provinces
  loadAllProvinces(): void {
    this.loadingProvinces = true;
    this.provinceService.getAllProvinces().subscribe(
      (data) => {
        this.provinces = data.data;
        this.filteredProvinces = [...this.provinces];
        this.loadingProvinces = false;
      },
      (error) => {
        console.error('Error loading provinces', error);
        this.loadingProvinces = false;
      }
    );
  }

  // Load all cities
  loadAllCities(): void {
    this.loadingCities = true;
    this.cityService.getAllCities().subscribe(
      (data) => {
        this.allCities = data.data;
        this.filteredCities = this.getCitiesForSelectedProvinces();
        this.loadingCities = false;
      },
      (error) => {
        console.error('Error loading cities', error);
        this.loadingCities = false;
      }
    );
  }

  // Toggle province dropdown
  toggleProvinceDropdown(): void {
    this.showProvinceDropdown = !this.showProvinceDropdown;
    if (this.showProvinceDropdown) {
      this.showCityDropdown = false;
      this.provinceSearch = '';
      this.filterProvinces();
    }
  }

  // Toggle city dropdown
  toggleCityDropdown(): void {
    this.showCityDropdown = !this.showCityDropdown;
    if (this.showCityDropdown) {
      this.showProvinceDropdown = false;
      this.citySearch = '';
      this.filterCities();
    }
  }

  // Filter provinces based on search term
  filterProvinces(): void {
    if (!this.provinceSearch) {
      this.filteredProvinces = [...this.provinces];
      return;
    }
    this.filteredProvinces = this.provinces.filter(province =>
      province.name.toLowerCase().includes(this.provinceSearch.toLowerCase())
    );
  }

  // Filter cities based on search term and selected provinces
  filterCities(): void {
    let cities = this.getCitiesForSelectedProvinces();
    
    if (this.citySearch) {
      cities = cities.filter(city =>
        city.name.toLowerCase().includes(this.citySearch.toLowerCase())
      );
    }
    
    this.filteredCities = cities;
  }

  // Get cities for currently selected provinces
  getCitiesForSelectedProvinces(): City[] {
    if (this.selectedProvinces.length === 0) {
      return [...this.allCities];
    }
    return this.allCities.filter(city => 
      this.selectedProvinces.includes(city.province.id)
    );
  }

  // Check if province is selected
  isProvinceSelected(provinceId: number): boolean {
    return this.selectedProvinces.includes(provinceId);
  }

  // Check if city is selected
  isCitySelected(cityId: number): boolean {
    return this.selectedCities.includes(cityId);
  }

  // Toggle province selection
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

  // Toggle city selection
  toggleCitySelection(cityId: number): void {
    if (this.isCitySelected(cityId)) {
      this.selectedCities = this.selectedCities.filter(id => id !== cityId);
    } else {
      this.selectedCities = [...this.selectedCities, cityId];
    }
    this.updateFormValues();
  }

  // Update form values with current selections
  updateFormValues(): void {
    this.campaignForm.patchValue({
      provinceId: this.selectedProvinces,
      cityId: this.selectedCities
    });
  }

  // Get labels for selected provinces
  getSelectedProvinceLabels(): string {
    if (this.selectedProvinces.length === 0) return 'All provinces (optional)';
    if (this.selectedProvinces.length === this.provinces.length) return 'All provinces selected';
    if (this.selectedProvinces.length > 3) return `${this.selectedProvinces.length} provinces selected`;
    
    return this.selectedProvinces
      .map(id => this.provinces.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  // Get labels for selected cities
  getSelectedCityLabels(): string {
    if (this.selectedCities.length === 0) return 'All cities in selected provinces (optional)';
    if (this.selectedCities.length > 3) return `${this.selectedCities.length} cities selected`;
    
    return this.selectedCities
      .map(id => {
        const city = this.allCities.find(c => c.id === id);
        return city ? `${city.name} (${city.province.name})` : '';
      })
      .filter(Boolean)
      .join(', ');
  }

  // Get province name by ID
  getProvinceName(provinceId: number): string {
    return this.provinces.find(p => p.id === provinceId)?.name || '';
  }

  // Calculate campaign price
  calculatePrice(impressions: number): void {
    this.calculatedPrice = (impressions / 1000) * this.pricePer1000;
  }
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 50 * 1024 * 1024) {
    alert('File size exceeds 50MB limit');
    return;
  }

  const video = document.createElement('video');
  video.preload = 'metadata';

  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src);
    
    // Check aspect ratio (4:3 or 16:10 landscape)
    const aspectRatio = video.videoWidth / video.videoHeight;
    const isTabletLandscape = 
      (video.videoWidth > video.videoHeight) && 
      (Math.abs(aspectRatio - (4/3)) < 0.2 || 
      Math.abs(aspectRatio - (16/10)) < 0.2);
    
    if (!isTabletLandscape) {
      alert('Please upload a landscape video with tablet aspect ratio (approximately 4:3 or 16:10).');
      return;
    }

    if (video.videoWidth < 1024 || video.videoHeight < 600) {
      alert('Video resolution too small. Please upload a video with at least 1024x600 resolution.');
      return;
    }

    this.selectedFile = file;
    this.videoDimensions = {
      width: video.videoWidth,
      height: video.videoHeight
    };
  };

  video.onerror = () => {
    alert('Invalid video file. Please upload a valid video file.');
    window.URL.revokeObjectURL(video.src);
  };

  video.src = URL.createObjectURL(file);
}

  // Remove selected file
  removeFile(): void {
    this.selectedFile = null;
  }
private formatDateForBackend(date: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const ms = (n: number) => n.toString().padStart(3, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.` +
         `${ms(date.getMilliseconds())}`;
}

  // Submit form
onSubmit(): void {
  this.formSubmitted = true;
  
  if (this.campaignForm.invalid || !this.selectedFile) {
    return;
  }

  this.isLoading = true;

  const startDate = new Date(this.campaignForm.value.startDate);
  const endDate = new Date(this.campaignForm.value.endDate);

  // Format dates exactly as backend expects
  const formattedStartDate = this.formatDateForBackend(startDate);
  const formattedEndDate = this.formatDateForBackend(endDate);

  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('name', this.campaignForm.value.name);
  formData.append('description', this.campaignForm.value.description);
  formData.append('startDate', formattedStartDate);
  formData.append('endDate', formattedEndDate);
  formData.append('requiredImpressions', this.campaignForm.value.requiredImpressions.toString());

  // Append each city ID if any are selected
  if (this.selectedCities.length > 0) {
    this.selectedCities.forEach(cityId => {
      formData.append('cityId', cityId.toString());
    });
  }
  
  // Append each province ID if any are selected
  if (this.selectedProvinces.length > 0) {
    this.selectedProvinces.forEach(provinceId => {
      formData.append('provinceId', provinceId.toString());
    });
  }
  
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

  // Close dropdowns when clicking outside
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










