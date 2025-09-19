import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../model/campaign.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../campaign/confirm-dialog/confirm-dialog.component';
import { AdvertiserService } from '../../services/advertiser.service';
import { Advertiser } from '../../model/adverrtiser.model';
import { ProvinceService } from '../../services/profile.service';
import { CityService } from '../../services/city.service';
import { FileType } from '../../services/file-type';
import { DocumentPurpose } from '../../services/document-purpose';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class CampaignComponent implements OnInit {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  loading = true;
  statusFilter: string = 'all';
  isMenuOpen: boolean = false;

  // KPI stats
  totalCampaigns = 0;
  activeCampaignsCount = 0;
  inactiveCampaignsCount = 0;
  totalBudget = 0;

  // Modal state
  showAddCampaignModal = false;
  isLoading = false;
  addCampaignForm: FormGroup;
  advertisers: Advertiser[] = [];
  loadingAdvertisers = false;
  
  // Additional form data
  provinces: any[] = [];
  allCities: any[] = [];
  selectedFile: File | null = null;
  videoDimensions: {width: number, height: number} | null = null;
  calculatedPrice = 0;
  pricePer1000 = 1500;
  fileTypes = Object.values(FileType);
  documentPurposes = Object.values(DocumentPurpose);
  
  // Province/City selection
  showProvinceDropdown = false;
  showCityDropdown = false;
  provinceSearch = '';
  citySearch = '';
  filteredProvinces: any[] = [];
  filteredCities: any[] = [];
  selectedProvinces: number[] = [];
  selectedCities: number[] = [];

  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private dialog: MatDialog,
    private advertiserService: AdvertiserService,
    private formBuilder: FormBuilder,
    private provinceService: ProvinceService,
    private cityService: CityService
  ) {
    this.addCampaignForm = this.formBuilder.group({
      advertiserId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      ctaUrl: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      requiredImpressions: [1000, [Validators.required, Validators.min(1000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      provinceId: [[]],
      cityId: [[]],
      mediaFileType: [FileType.VIDEO, Validators.required],
      documentPurpose: [DocumentPurpose.CAMPAIGN_VIDEO, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadAdvertisers();
    this.loadAllProvinces();
    this.loadAllCities();
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.addCampaignForm.get('requiredImpressions')?.valueChanges.subscribe(val => {
      this.calculatePrice(val);
    });
  }

  calculatePrice(impressions: number): void {
    this.calculatedPrice = (impressions / 1000) * this.pricePer1000;
  }

  loadAllProvinces(): void {
    this.provinceService.getAllProvinces().subscribe({
      next: (response) => {
        this.provinces = response.data || [];
        this.filteredProvinces = [...this.provinces];
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  loadAllCities(): void {
    this.cityService.getAllCities().subscribe({
      next: (response) => {
        this.allCities = response.data || [];
        this.filteredCities = [...this.allCities];
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadAdvertisers(): void {
    this.loadingAdvertisers = true;
    this.advertiserService.getAllAdvertisers().subscribe({
      next: (response) => {
        this.advertisers = response.data || [];
        this.loadingAdvertisers = false;
      },
      error: (error) => {
        console.error('Error loading advertisers:', error);
        this.loadingAdvertisers = false;
      }
    });
  }

  loadCampaigns(): void {
    this.loading = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (response) => {
        this.campaigns = response.data;
        this.filterCampaigns();
        this.loading = false;
        this.updateStats();
      },
      error: (err) => {
        console.error('Error fetching campaigns:', err);
        this.loading = false;
      },
    });
  }

  filterCampaigns(): void {
    if (this.statusFilter === 'all') {
      this.filteredCampaigns = [...this.campaigns];
    } else {
      const isActive = this.statusFilter === 'active';
      this.filteredCampaigns = this.campaigns.filter(
        (campaign) => campaign.active === isActive
      );
    }
  }

  private updateStats(): void {
    const all = this.campaigns || [];
    this.totalCampaigns = all.length;
    this.activeCampaignsCount = all.filter(c => !!c.active).length;
    this.inactiveCampaignsCount = Math.max(0, this.totalCampaigns - this.activeCampaignsCount);
    this.totalBudget = all.reduce((sum, c) => sum + (Number(c.price) || 0), 0);
  }

  addCampaign(): void {
    this.openAddCampaignModal();
  }

  // Modal methods
  openAddCampaignModal(): void {
    this.showAddCampaignModal = true;
  }

  closeAddCampaignModal(): void {
    this.showAddCampaignModal = false;
    this.addCampaignForm.reset();
    this.addCampaignForm.patchValue({
      requiredImpressions: 1000,
      price: 0,
      mediaFileType: FileType.VIDEO,
      documentPurpose: DocumentPurpose.CAMPAIGN_VIDEO
    });
    this.selectedFile = null;
    this.videoDimensions = null;
    this.selectedProvinces = [];
    this.selectedCities = [];
    this.showProvinceDropdown = false;
    this.showCityDropdown = false;
  }

  // Province/City selection methods
  toggleProvinceDropdown(): void {
    this.showProvinceDropdown = !this.showProvinceDropdown;
    this.showCityDropdown = false;
  }

  toggleCityDropdown(): void {
    this.showCityDropdown = !this.showCityDropdown;
    this.showProvinceDropdown = false;
  }

  filterProvinces(): void {
    this.filteredProvinces = this.provinces.filter(province =>
      province.name.toLowerCase().includes(this.provinceSearch.toLowerCase())
    );
  }

  filterCities(): void {
    let cities = this.getCitiesForSelectedProvinces();
    
    if (this.citySearch) {
      cities = cities.filter(city =>
        city.name.toLowerCase().includes(this.citySearch.toLowerCase())
      );
    }
    
    this.filteredCities = cities;
  }

  getCitiesForSelectedProvinces(): any[] {
    if (this.selectedProvinces.length === 0) {
      return [...this.allCities];
    }
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

  updateFormValues(): void {
    this.addCampaignForm.patchValue({
      provinceId: this.selectedProvinces,
      cityId: this.selectedCities
    });
  }

  getSelectedProvinceLabels(): string {
    if (this.selectedProvinces.length === 0) return 'All provinces (optional)';
    if (this.selectedProvinces.length === this.provinces.length) return 'All provinces selected';
    if (this.selectedProvinces.length > 3) return `${this.selectedProvinces.length} provinces selected`;
    
    return this.selectedProvinces
      .map(id => this.provinces.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

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

  getProvinceName(provinceId: number): string {
    return this.provinces.find(p => p.id === provinceId)?.name || '';
  }

  // File upload methods
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size exceeds 50MB limit'
      });
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
        Swal.fire({
          icon: 'error',
          title: 'Invalid Aspect Ratio',
          text: 'Please upload a landscape video with tablet aspect ratio (approximately 4:3 or 16:10).'
        });
        return;
      }

      if (video.videoWidth < 1024 || video.videoHeight < 600) {
        Swal.fire({
          icon: 'error',
          title: 'Resolution Too Small',
          text: 'Please upload a video with at least 1024x600 resolution.'
        });
        return;
      }

      this.selectedFile = file;
      this.videoDimensions = {
        width: video.videoWidth,
        height: video.videoHeight
      };
    };

    video.onerror = () => {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Video File',
        text: 'Please upload a valid video file.'
      });
      window.URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.videoDimensions = null;
  }

  onSubmitCampaign(): void {
    if (this.addCampaignForm.valid && this.selectedFile) {
      this.isLoading = true;
      const formValue = this.addCampaignForm.getRawValue();
      
      // Calculate price based on impressions
      const calculatedPrice = (formValue.requiredImpressions / 1000) * this.pricePer1000;
      formValue.price = calculatedPrice;

      // Format dates for backend
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);
      
      const formatDate = (date: Date): string => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const padMilli = (n: number) => n.toString().padStart(3, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.` +
               `${padMilli(date.getMilliseconds())}`;
      };

      // Create FormData for the API
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('advertiserId', formValue.advertiserId);
      formData.append('name', formValue.name);
      formData.append('description', formValue.description);
      formData.append('ctaUrl', formValue.ctaUrl || '');
      formData.append('startDate', formatDate(startDate));
      formData.append('endDate', formatDate(endDate));
      formData.append('requiredImpressions', formValue.requiredImpressions.toString());
      formData.append('price', calculatedPrice.toString());
      // Add province IDs as individual parameters
      this.selectedProvinces.forEach(provinceId => {
        formData.append('provinceId', provinceId.toString());
      });
      
      // Add city IDs as individual parameters  
      this.selectedCities.forEach(cityId => {
        formData.append('cityId', cityId.toString());
      });
      formData.append('mediaFileType', formValue.mediaFileType);
      formData.append('documentPurpose', formValue.documentPurpose);

      this.campaignService.createCampaign(formData).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Campaign Created Successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.loadCampaigns(); // Refresh the list
            this.closeAddCampaignModal();
            this.isLoading = false;
          });
        },
        error: (error: any) => {
          console.error('Error creating campaign:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Campaign',
            text: error?.error?.message || 'An unexpected error occurred.',
          });
          this.isLoading = false;
        }
      });
    } else {
      this.addCampaignForm.markAllAsTouched();
      if (!this.selectedFile) {
        Swal.fire({
          icon: 'warning',
          title: 'Media File Required',
          text: 'Please select a media file for your campaign.'
        });
      }
    }
  }

  viewCampaignDetails(campaignId: number): void {
    this.router.navigate(['/campaign', campaignId]);
  }

  viewCampaignAnalytics(campaignId: number): void {
    this.router.navigate(['/campaign', campaignId, 'analytics']);
  }

  editCampaign(campaignId: number): void {
    // Navigate to editable form route
    this.router.navigate(['/campaigns/edit', campaignId]);
  }

  toggleActive(campaign: Campaign): void {
    const req$ = campaign.active
      ? this.campaignService.deactivateCampaign(campaign.id)
      : this.campaignService.activateCampaign(campaign.id);

    req$.subscribe({
      next: () => {
        // Update item in place to avoid reordering/jumping
        const updatedActive = !campaign.active;
        const idx = this.campaigns.findIndex(c => c.id === campaign.id);
        if (idx !== -1) {
          this.campaigns[idx] = { ...this.campaigns[idx], active: updatedActive } as Campaign;
        }
        // Re-apply current filter without refetching or re-sorting
        this.filterCampaigns();
        this.updateStats();
      },
      error: (err: any) => console.error('Error updating campaign status:', err)
    });
  }

  deleteCampaign(campaignId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Campaign',
        message: 'Are you sure you want to delete this campaign?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.campaignService.deleteCampaign(campaignId).subscribe({
          next: () => {
            this.loadCampaigns();
          },
          error: (err) => {
            console.error('Error deleting campaign:', err);
          },
        });
      }
    });
  }

  clearFilters() {
    this.statusFilter = 'all';
    this.filterCampaigns();
  }

  trackById(_index: number, item: Campaign) {
    return item.id;
  }

  // Drag and drop handler for reordering visible rows
  drop(event: CdkDragDrop<Campaign[]>) {
    if (!this.filteredCampaigns || this.filteredCampaigns.length === 0) return;
    moveItemInArray(this.filteredCampaigns, event.previousIndex, event.currentIndex);
    // Persist order to backend based on new indices
    const order = this.filteredCampaigns.map((c, idx) => ({ id: c.id, position: idx }));
    this.campaignService.reorderCampaigns(order).subscribe({
      next: () => {},
      error: (err) => console.error('Failed to save order', err)
    });
  }
}
