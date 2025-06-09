import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TabletService } from '../../../services/tablet.service';
import { DriverProfile } from '../../../api/Response/interfaces';
import { DriverComponent } from '../../driver/driver.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

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
        <input [(ngModel)]="searchQuery" (input)="searchDrivers()" 
               placeholder="Search drivers..." class="w-full p-2 border rounded mb-4">
        
        <div *ngIf="isLoading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div *ngIf="drivers.length === 0 && !isLoading" class="text-center py-4 text-gray-500">
          No drivers found
        </div>
        
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div *ngFor="let driver of drivers" 
               class="p-3 border rounded hover:bg-gray-50 cursor-pointer"
               [class.bg-blue-50]="selectedDriver?.accountId === driver.accountId"
               (click)="selectDriver(driver)">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">{{driver.firstName}} {{driver.lastName}}</p>
                <p class="text-sm text-gray-600">{{driver.phoneNo}}</p>
              </div>
              <div *ngIf="selectedDriver?.accountId === driver.accountId" class="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button (click)="onCancel()" 
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button (click)="onAssign()" [disabled]="!selectedDriver"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
          Assign Tablet
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class AssignTabletComponent {
  drivers: DriverProfile[] = [];
  isLoading = false;
  searchQuery = '';
  selectedDriver: DriverProfile | null = null;

  constructor(
    private userService: DriverComponent,
    private tabletService: TabletService,
    private dialogRef: MatDialogRef<AssignTabletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadDrivers();
  }


    filteredDrivers: DriverProfile[] = [];
loadDrivers(): void {
  if (!this.searchQuery || this.searchQuery.trim() === '') {
    this.filteredDrivers = [...this.drivers];
  } else {
    const query = this.searchQuery.toLowerCase();
    this.filteredDrivers = this.drivers.filter(driver =>
      driver.firstName.toLowerCase().includes(query) || // example field
      driver.email?.toLowerCase().includes(query)  // another example
    );
  }
}

  searchDrivers() {
    this.loadDrivers();
  }

  selectDriver(driver: DriverProfile) {
    this.selectedDriver = driver;
  }

  onAssign() {
    if (this.selectedDriver) {
      this.isLoading = true;
      this.tabletService.assignTablet(this.data.tablet.id, this.selectedDriver.accountId)
        .subscribe({
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

  onCancel() {
    this.dialogRef.close();
  }
}