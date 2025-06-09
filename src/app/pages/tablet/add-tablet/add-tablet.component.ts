import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriverProfile } from '../../../api/Response/interfaces';
import { TabletService } from '../../../services/tablet.service';
import { DriverComponent } from '../../driver/driver.component'; // Assuming this is a wrapper for UserService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [
    CommonModule,
FormsModule
  ],
  selector: 'app-assign-tablet',
  template: `
    <div class="p-6 bg-white rounded-lg shadow-xl max-w-2xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Assign Tablet to Driver</h2>

      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Tablet Details</h3>
        <p><span class="font-medium">Model:</span> {{data.tablet.model}}</p>
        <p><span class="font-medium">Serial:</span> {{data.tablet.serialNumber}}</p>
      </div>

      <div class="mb-4">
        <input
          [(ngModel)]="searchQuery"
          (input)="searchDrivers()"
          placeholder="Search drivers..."
          class="w-full p-2 border rounded mb-4"
        />

        <div *ngIf="isLoading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div *ngIf="filteredDrivers.length === 0 && !isLoading" class="text-center py-4 text-gray-500">
          No drivers found
        </div>

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            *ngFor="let driver of filteredDrivers"
            class="p-3 border rounded hover:bg-gray-50 cursor-pointer"
            [class.bg-blue-50]="selectedDriver?.accountId === driver.accountId"
            (click)="selectDriver(driver)"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">{{ driver.firstName }} {{ driver.lastName }}</p>
                <p class="text-sm text-gray-600">{{ driver.phoneNo }}</p>
              </div>
              <div *ngIf="selectedDriver?.accountId" class="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button (click)="onCancel()" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button
          (click)="onAssign()"
          [disabled]="!selectedDriver"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          Assign Tablet
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class AssignTabletComponent {
  drivers: DriverProfile[] = [];
  filteredDrivers: DriverProfile[] = [];
  selectedDriver: DriverProfile | null = null;
  isLoading = false;
  searchQuery = '';

  constructor(
    private userService: DriverComponent, // Replace with actual service if necessary
    private tabletService: TabletService,
    private dialogRef: MatDialogRef<AssignTabletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadDrivers();
  }

loadDrivers(): void {
  this.isLoading = true;
  this.userService.fetchDriversd().subscribe({
    next: (drivers: DriverProfile[]) => {
      this.drivers = drivers;
      this.filteredDrivers = [...drivers];
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching drivers:', error);
      this.isLoading = false;
    }
  });
}


  searchDrivers(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredDrivers = [...this.drivers];
      return;
    }

    this.filteredDrivers = this.drivers.filter(driver =>
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(query) ||
      driver.phoneNo?.toLowerCase().includes(query) ||
      driver.email?.toLowerCase().includes(query)
    );
  }

  selectDriver(driver: DriverProfile): void {
    this.selectedDriver = driver;
  }

  onAssign(): void {
    if (this.selectedDriver) {
      this.isLoading = true;
      this.tabletService.assignTablet(this.data.tablet.id, this.selectedDriver.accountId).subscribe({
        next: (updatedTablet) => {
          this.dialogRef.close(updatedTablet);
        },
        error: (err) => {
          console.error('Assignment failed:', err);
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
