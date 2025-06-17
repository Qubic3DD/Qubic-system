// tablet-view.component.ts
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TabletService } from '../../../services/tablet.service';
import { UserSelectDialogComponent } from '../user-select-dialog/user-select-dialog.component';

import { Tablet } from '../../../api/Request/Tablet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ConfirmDialogComponent } from '../../../pages/campaign/confirm-dialog/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-tablet-view',
  templateUrl: './tablet-view.component.component.html',
  styleUrls: ['./tablet-view.component.component.css'],
    imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
        CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    NgxChartsModule,
     MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule

  ],
})
export class TabletViewComponent implements OnInit {
  tablet: Tablet | null = null;
  isLoading = true;
  error: string | null = null;

  // Status colors mapping
statusColors = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  LOST: 'bg-red-100 text-red-800',
  DECOMMISSIONED: 'bg-gray-100 text-gray-800',
  DEFAULT: 'bg-gray-200 text-gray-600' // fallback style
};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private tabletService: TabletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { tabletId: number }  // <-- expect tabletId here
  ) {}

  ngOnInit(): void {
    this.loadTablet();
    this.isLoading = false;
  }

loadTablet(): void {
  const id = this.data.tabletId;  // get id from injected data here
  if (!id) {
    this.error = 'No tablet ID provided';
    this.isLoading = false;
    return;
  }

  this.isLoading = true;
  this.tabletService.getTabletById(id).subscribe({
    next: (tablet: Tablet | null) => {
      this.tablet = tablet;
      this.isLoading = false;
    },
    error: (err: { message: string }) => {
      this.error = err.message || 'Failed to load tablet';
      this.isLoading = false;
    }
  });
}

  assignTablet(): void {
    if (!this.tablet) return;

    const dialogRef = this.dialog.open(UserSelectDialogComponent, {
      width: '500px',
      data: { title: 'Assign Tablet', tabletId: this.tablet.id }
    });

    dialogRef.afterClosed().subscribe((userId: number) => {
      if (userId) {
        this.tabletService.assignTablet(this.tablet!.id!, userId).subscribe({
          next: (updatedTablet: Tablet | null) => {
            this.tablet = updatedTablet;
            this.snackBar.open('Tablet assigned successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to assign tablet', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  unassignTablet(): void {
    if (!this.tablet) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Unassign',
        message: `Are you sure you want to unassign this tablet from ${this.tablet.user?.firstName} ${this.tablet.user?.lastName}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tabletService.unassignTablet(this.tablet!.id!).subscribe({
          next: (updatedTablet: Tablet | null) => {
            this.tablet = updatedTablet;
            this.snackBar.open('Tablet unassigned successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to unassign tablet', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  editTablet(): void {
    if (!this.tablet) return;

    // const dialogRef = this.dialog.open(EditTabletDialogComponent, {
    //   width: '600px',
    //   data: { tablet: this.tablet }
    // });

    // dialogRef.afterClosed().subscribe((result: Tablet | undefined) => {
    //   if (result) {
    //     this.tablet = { ...this.tablet, ...result };
    //     this.snackBar.open('Tablet updated successfully!', 'Close', { duration: 3000 });
    //   }
    // });
  }

  changeStatus(newStatus: Tablet['status']): void {
    if (!this.tablet || this.tablet.status === newStatus) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Status Change',
        message: `Are you sure you want to change status to ${newStatus}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tabletService.updateTablet(this.tablet!.id!, { status: newStatus }).subscribe({
          next: (updatedTablet: Tablet | null) => {
            this.tablet = updatedTablet;
            this.snackBar.open('Status updated successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  navigateToUser(): void {
    if (this.tablet?.user?.id) {
      this.router.navigate(['/users', this.tablet.user.id]);
    }
  }
}