import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampaignService } from '../../services/campaign.service';
import { CityService } from '../../services/city.service';
import { ProvinceService } from '../../services/profile.service';
import { City, Province } from '../campaign/campaign/add-campaign/add-campaign.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatSelectionList } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-campaign-edit',
  templateUrl: './camapign-edit.component.html',
  styleUrls: ['./camapign-edit.component.css'],
  imports:[
MatInputModule,MatFormFieldModule,MatProgressSpinnerModule,MatSnackBarModule,MatListModule,MatNativeDateModule,ReactiveFormsModule,

MatSelectionList,MatDatepickerModule,MatSlideToggleModule,MatSelectModule,CommonModule
  

  ]

})
export class CamapignEditComponentPages implements OnInit {
  campaignForm: FormGroup;
  campaignId!: number;
  isLoading = true;
  isSubmitting = false;
  cities: City[] = [];
  provinces: Province[] = [];
  minDate: Date;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private cityService: CityService,
    private provinceService: ProvinceService,
    private snackBar: MatSnackBar
  ) {
    this.minDate = new Date();
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      requiredImpressions: ['', [Validators.required, Validators.min(1000)]],
      price: ['', [Validators.required, Validators.min(1000)]],
      targetCityIds: [[]],
      targetProvinceIds: [[]],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLocations();
    this.loadCampaign();
  }

  onCancel(): void {
  if (this.campaignForm.dirty) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      this.router.navigate(['/advertiser-dashboard/edit', this.campaignId]);
    }
  } else {
    this.router.navigate(['/advertiser-dashboard/edit', this.campaignId]);
  }
}
navigateToEditCampaign(campaignId: number): void {
  this.router.navigate(['/advertiser-dashboard/edit', campaignId]);
}
  loadLocations(): void {
    this.provinceService.getAllProvinces().subscribe({
      next: (response) => {
        this.provinces = response.data;
      },
      error: (err) => {
        console.error('Error loading provinces:', err);
        this.snackBar.open('Failed to load provinces', 'Close', { duration: 3000 });
      }
    });

    this.cityService.getAllCities().subscribe({
      next: (response) => {
        this.cities = response.data;
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.snackBar.open('Failed to load cities', 'Close', { duration: 3000 });
      }
    });
  }

loadCampaign(): void {
  this.campaignService.getCampaignById(this.campaignId!).subscribe({
    next: (response) => {
      const campaign = response.data;
      
      // Helper function to extract IDs whether they're objects or numbers
      const extractIds = (items: (number | { id: number })[]): number[] => {
        return items.map(item => typeof item === 'number' ? item : item.id);
      };

      this.campaignForm.patchValue({
        name: campaign.name,
        description: campaign.description,
        startDate: this.formatDateForInput(campaign.startDate),
        endDate: this.formatDateForInput(campaign.endDate),
        requiredImpressions: campaign.requiredImpressions,
        price: campaign.price,
        targetCityIds: campaign.targetCities ? extractIds(campaign.targetCities) : [],
        targetProvinceIds: campaign.targetProvinces ? extractIds(campaign.targetProvinces) : [],
        active: campaign.active
      });
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading campaign:', err);
      this.snackBar.open('Failed to load campaign details', 'Close', { duration: 3000 });
      this.isLoading = false;
    }
  });
}
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Converts to YYYY-MM-DDTHH:MM format
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const formData = this.campaignForm.value;

    // Prepare data for API
    const requestData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    this.campaignService.updateCampaign(this.campaignId!, requestData).subscribe({
      next: () => {
        this.snackBar.open('Campaign updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/campaigns', this.campaignId]);
      },
      error: (err) => {
        console.error('Error updating campaign:', err);
        this.snackBar.open('Failed to update campaign', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }


}