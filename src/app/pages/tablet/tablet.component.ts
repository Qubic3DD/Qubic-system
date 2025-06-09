import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { Tablet, UserInfo } from '../../api/Request/Tablet'; // Adjust import path
import { TabletService } from '../../services/tablet.service';
import { AddTabletComponent } from './add-tablet/add-tablet.component'; // Adjust path if needed
import { UserSelectDialogComponent } from './user-select-dialog/user-select-dialog.component';

@Component({
  selector: 'app-tablet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css'],
})
export class TabletComponent implements OnInit {
  searchQuery = '';
  selectedTablet: Tablet | null = null;
  selectedUser: UserInfo | null = null;
  activeDropdown: number | null = null;
  tablets: Tablet[] = [];
  isLoading = false;
  error: string | null = null;

  // Count properties
  availableCount = 0;
  assignedCount = 0;
  maintenanceCount = 0;

  constructor(
    private tabletService: TabletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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
        error: () => this.error = 'Failed to load tablets'
      });
  }

  updateCounts(): void {
    this.availableCount = this.tablets.filter(t => t.status === 'AVAILABLE').length;
    this.assignedCount = this.tablets.filter(t => t.status === 'ASSIGNED').length;
    this.maintenanceCount = this.tablets.filter(t => t.status === 'MAINTENANCE').length;
  }

  get filteredTablets(): Tablet[] {
    if (!this.searchQuery) {
      return this.tablets;
    }
    const q = this.searchQuery.toLowerCase();
    return this.tablets.filter(tab =>
      (tab.model?.toLowerCase().includes(q) ?? false) ||
      (tab.serialNumber?.toLowerCase().includes(q) ?? false) ||
      ((tab.user?.firstName && tab.user?.lastName)
        ? `${tab.user.firstName} ${tab.user.lastName}`.toLowerCase().includes(q)
        : false)
    );
  }

viewTabletInfo(tablet: Tablet): void {
  this.selectedTablet = tablet;
  this.selectedUser = null; // Clear any previous user selection
}
viewUserInfo(user: UserInfo): void {
  this.selectedUser = user;
  this.selectedTablet = null; // Clear any previous tablet selection
}

  addTablet(): void {
    const dialogRef = this.dialog.open(AddTabletComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Tablet | undefined) => {
      if (result) {
        this.refreshTabletList();
        this.snackBar.open('Tablet added successfully!', 'Close', { duration: 3000 });
        console.log('Tablet added:', result);
      }
    });
  }

  refreshTabletList(): void {
    this.tabletService.getAllTablets().subscribe(tablets => {
      this.tablets = tablets;
      this.updateCounts();
    });
  }

  removeTablet(id: number): void {
    if (confirm('Are you sure you want to remove this tablet?')) {
      this.tabletService.deleteTablet(id).subscribe({
        next: () => {
          this.tablets = this.tablets.filter(t => t.id !== id);
          this.updateCounts();
        },
        error: () => {
          this.error = 'Failed to delete tablet';
        }
      });
    }
  }



  toggleDropdown(id: number): void {
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

closeModal(): void {
  this.selectedTablet = null;
  this.selectedUser = null;
  this.activeDropdown = null; // Also close any open dropdowns
}
  openAssignDialog(tablet: Tablet): void {
  const dialogRef = this.dialog.open(UserSelectDialogComponent, {
    width: '500px',
    data: { title: 'Assign Tablet', tabletId: tablet.id }
  });

  dialogRef.afterClosed().subscribe((userId: number) => {
    if (userId) {
      this.assignTablet(tablet.id!, userId);
    }
  });
}

openReassignDialog(tablet: Tablet): void {
  const dialogRef = this.dialog.open(UserSelectDialogComponent, {
    width: '500px',
    data: { title: 'Reassign Tablet', tabletId: tablet.id }
  });

  dialogRef.afterClosed().subscribe((userId: number) => {
    if (userId) {
      this.reassignTablet(tablet.id!, userId);
    }
  });
}

assignTablet(tabletId: number, userId: number): void {
  this.tabletService.assignTablet(tabletId, userId).subscribe({
    next: (updatedTablet) => {
      this.updateTabletInList(updatedTablet);
      this.snackBar.open('Tablet assigned successfully!', 'Close', { duration: 3000 });
    },
    error: () => {
      this.snackBar.open('Failed to assign tablet', 'Close', { duration: 3000 });
    }
  });
}

reassignTablet(tabletId: number, userId: number): void {
  this.tabletService.assignTablet(tabletId, userId).subscribe({
    next: (updatedTablet) => {
      this.updateTabletInList(updatedTablet);
      this.snackBar.open('Tablet reassigned successfully!', 'Close', { duration: 3000 });
    },
    error: () => {
      this.snackBar.open('Failed to reassign tablet', 'Close', { duration: 3000 });
    }
  });
}

unassignTablet(tabletId: number): void {
  if (confirm('Are you sure you want to unassign this tablet?')) {
    this.tabletService.unassignTablet(tabletId).subscribe({
      next: (updatedTablet) => {
        this.updateTabletInList(updatedTablet);
        this.snackBar.open('Tablet unassigned successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to unassign tablet', 'Close', { duration: 3000 });
      }
    });
  }
}

updateTabletInList(updatedTablet: Tablet): void {
  const index = this.tablets.findIndex(t => t.id === updatedTablet.id);
  if (index !== -1) {
    this.tablets[index] = updatedTablet;
    this.updateCounts();
  }
  if (this.selectedTablet?.id === updatedTablet.id) {
    this.selectedTablet = updatedTablet;
  }
}

editTablet(tablet: Tablet): void {
  const dialogRef = this.dialog.open(AddTabletComponent, {
    width: '600px',
    data: { tablet }
  });

  dialogRef.afterClosed().subscribe((result: Tablet | undefined) => {
    if (result) {
      this.updateTabletInList(result);
      this.snackBar.open('Tablet updated successfully!', 'Close', { duration: 3000 });
    }
  });
}

openUserAssignmentDialog(tablet: Tablet, title: string): void {
  const dialogRef = this.dialog.open(UserSelectDialogComponent, {
    width: '500px',
    data: { title, tabletId: tablet.id }
  });

  dialogRef.afterClosed().subscribe((userId: number) => {
    if (userId) {
      this.assignTablet(tablet.id!, userId);
    }
  });
}

}
