import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TabletService } from '../../services/tablet.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tablet',
  standalone: true,
  imports: [
    
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css'],
})
export class TabletComponent implements OnInit {
  searchQuery = '';
  selectedTablet: any = null;
  selectedUser: any = null;
  activeDropdown: number | null = null;
  tablets: any[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Count properties
  availableCount = 0;
  assignedCount = 0;
  maintenanceCount = 0;

  constructor(private tabletService: TabletService) {}

  ngOnInit(): void {
    this.loadTablets();
  }

  loadTablets(): void {
    this.isLoading = true;
    this.tabletService.getAllTablets()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (tablets) => {
          this.tablets = tablets;
          this.updateCounts();
        },
        error: (err) => this.error = 'Failed to load tablets'
      });
  }

  updateCounts(): void {
    this.availableCount = this.tablets.filter(t => t.status === 'AVAILABLE').length;
    this.assignedCount = this.tablets.filter(t => t.status === 'ASSIGNED').length;
    this.maintenanceCount = this.tablets.filter(t => t.status === 'MAINTENANCE').length;
  }

  get filteredTablets() {
    if (!this.searchQuery) {
      return this.tablets;
    }
    return this.tablets.filter(
      (tab) =>
        tab.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (tab.serialNumber && 
          tab.serialNumber.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (tab.userInformation && 
          `${tab.userInformation.firstName} ${tab.userInformation.lastName}`.toLowerCase()
            .includes(this.searchQuery.toLowerCase()))
    );
  }

  viewTabletInfo(tablet: any) {
    this.selectedTablet = tablet;
    this.selectedUser = tablet.userInformation || null;
  }

  viewUserInfo(user: any) {
    this.selectedUser = user;
  }

  addTablet() {
    // Implement with a form dialog
    alert('Add Tablet functionality would open a form popup here.');
  }

  removeTablet(id: number) {
    if (confirm('Are you sure you want to remove this tablet?')) {
      this.tabletService.deleteTablet(id).subscribe({
        next: () => {
          this.tablets = this.tablets.filter((t) => t.id !== id);
          this.updateCounts();
        },
        error: (err) => {
          this.error = 'Failed to delete tablet';
        }
      });
    }
  }

  assignTablet(tabletId: number) {
    // Implement with a user selection dialog
    const userId = 1; // This should come from a user selection dialog
    this.tabletService.assignTablet(tabletId, userId).subscribe({
      next: (updatedTablet) => {
        const index = this.tablets.findIndex(t => t.id === tabletId);
        if (index !== -1) {
          this.tablets[index] = updatedTablet;
          this.updateCounts();
        }
      },
      error: (err) => {
        this.error = 'Failed to assign tablet';
      }
    });
  }

  unassignTablet(tabletId: number) {
    this.tabletService.unassignTablet(tabletId).subscribe({
      next: (updatedTablet) => {
        const index = this.tablets.findIndex(t => t.id === tabletId);
        if (index !== -1) {
          this.tablets[index] = updatedTablet;
          this.updateCounts();
        }
      },
      error: (err) => {
        this.error = 'Failed to unassign tablet';
      }
    });
  }

  toggleDropdown(id: number): void {
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeModal() {
    this.selectedTablet = null;
    this.selectedUser = null;
  }
}