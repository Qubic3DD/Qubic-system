import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdvertiserProviderService } from '../../../../services/advertiser-provider.service';
import { CampaignService } from '../../../../services/campaign.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { FileSizePipe } from "./file-size.pipe";

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FileSizePipe
]
})
export class AddCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  advertisers: any[] = [];
  selectedFile: File | null = null;
  formSubmitted = false;
  isLoading = false;
  loadingAdvertisers = false;

  constructor(
    
    private fb: FormBuilder,
    private advertiserProvider: AdvertiserProviderService,
    private campaignService: CampaignService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.campaignForm = this.fb.group({
      advertiserId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      requiredImpressions: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]]
    });
  }
ngOnInit(): void {
  this.loadingAdvertisers = true;

  this.advertiserProvider.loadAdvertisers().pipe(
    finalize(() => this.loadingAdvertisers = false)
  ).subscribe();

  this.advertiserProvider.advertisers$.subscribe({
    next: (data) => {
      this.advertisers = data;
    },
    error: (err) => {
      console.error('Error fetching advertisers from stream:', err);
      this.snackBar.open('Failed to load advertisers', 'Close', { duration: 3000 });
    }
  });
}


loadAdvertisers(): void {
  this.loadingAdvertisers = true;

  this.advertiserProvider.loadAdvertisers().pipe(
    finalize(() => {
      this.loadingAdvertisers = false;
    })
  ).subscribe({
    next: () => {
      this.advertiserProvider.advertisers$.subscribe(data => {
        this.advertisers = data;
      });
    },
    error: (err) => {
      console.error('Error loading advertisers:', err);
      this.snackBar.open('Failed to load advertisers', 'Close', { duration: 3000 });
    }
  });
}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }
removeFile(): void {
  this.selectedFile = null;
}

  oonSubmit(): void {
  this.formSubmitted = true;

  if (this.campaignForm.invalid || !this.selectedFile) {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a media file', 'Close', { duration: 3000 });
    }
    return;
  }
const formatDateTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const SSS = date.getMilliseconds().toString().padStart(3, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${SSS}`;
};

  this.isLoading = true;

  const formData = new FormData();
  formData.append('advertiserId', this.campaignForm.value.advertiserId);
  formData.append('name', this.campaignForm.value.name);
  formData.append('description', this.campaignForm.value.description);
formData.append('startDate', formatDateTime(new Date(this.campaignForm.value.startDate)));
formData.append('endDate', formatDateTime(new Date(this.campaignForm.value.endDate)));
  formData.append('requiredImpressions', this.campaignForm.value.requiredImpressions);

  // Add missing required field mediaFileType, e.g. 'VIDEO'
  formData.append('mediaFileType', 'VIDEO');  // <-- must match file type

  // documentPurpose should match API allowed values
  formData.append('documentPurpose', 'CAMPAIGN_VIDEO');

  // This is key: The backend expects the file part named 'file'
  formData.append('file', this.selectedFile);

  this.campaignService.createCampaign(formData).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.snackBar.open('Campaign created successfully!', 'Close', { duration: 3000 });
      this.router.navigate(['/campaigns']);
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Error creating campaign:', err);
      this.snackBar.open(err.error?.message || 'Failed to create campaign', 'Close', { duration: 3000 });
    }
  });
}
}