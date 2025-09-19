import { Component, Inject } from '@angular/core';

import { TabletService } from '../../../services/tablet.service';
import { TabletMonitorService, TabletMonitorRow } from '../../../services/tablet-monitor.service';
import { UserInfo } from '../../../api/Request/Tablet';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel, MatOption } from '@angular/material/select';

@Component({
  selector: 'app-user-select-dialog',
  templateUrl: './user-select-dialog.component.html',
  styleUrls: ['./user-select-dialog.component.css'],
   standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatSpinner,
    MatOption,
    MatFormField,
    MatLabel

  ],

})
export class UserSelectDialogComponent {
  users: UserInfo[] = [];
  selectedUserId: number | null = null;
  private assignedDriverIds: Set<number> = new Set<number>();

  loading = true;
  snackBar: any;

  constructor(
    public dialogRef: MatDialogRef<UserSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tabletId?: number, deviceId?: string },
    private tabletService: TabletService,
    private tabletMonitorService: TabletMonitorService
  ) {
    this.loadUsers();
  }

loadUsers(): void {
  this.loading = true;
  this.tabletMonitorService.getMonitor().subscribe({
    next: (res) => {
      const rows: TabletMonitorRow[] = (res?.data || []) as TabletMonitorRow[];
      this.assignedDriverIds = new Set<number>(rows.filter(r => r.driverId != null).map(r => Number(r.driverId)));
      this.tabletService.getDrivers().subscribe({
        next: response => {
          const all = response.data || [];
          this.users = all.filter((u: any) => !this.assignedDriverIds.has(u.id));
          this.loading = false;
        },
        error: err => {
          console.error('Failed to load users', err);
          this.loading = false;
        }
      });
    },
    error: () => {
      this.tabletService.getDrivers().subscribe({
        next: response => {
          this.users = response.data || [];
          this.loading = false;
        },
        error: err => {
          console.error('Failed to load users', err);
          this.loading = false;
        }
      });
    }
  });
}


  onCancel(): void {
    this.dialogRef.close();
  }

onConfirm(): void {
  if (!this.selectedUserId) return;
  this.loading = true;
  // Prefer live monitor assignment if deviceId is provided
  if (this.data.deviceId) {
    this.tabletMonitorService.assign(this.data.deviceId, this.selectedUserId).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar?.open?.('Tablet assigned successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(this.selectedUserId);
      },
      error: err => {
        this.loading = false;
        console.error('Failed to assign tablet via deviceId', err);
        this.snackBar?.open?.('Failed to assign tablet. Please try again.', 'Close', { duration: 3000 });
      }
    });
    return;
  }

  if (this.data.tabletId) {
    this.tabletService.assignTabletToUser(this.data.tabletId, this.selectedUserId).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar?.open?.('Tablet assigned successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(this.selectedUserId);
      },
      error: err => {
        this.loading = false;
        console.error('Failed to assign tablet', err);
        this.snackBar?.open?.('Failed to assign tablet. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }



}}