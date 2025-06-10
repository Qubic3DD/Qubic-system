import { Component, Inject } from '@angular/core';

import { TabletService } from '../../../services/tablet.service';
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
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<UserSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tabletId?: number },
    private tabletService: TabletService
  ) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.tabletService.getDrivers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load users', err);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedUserId) {
      this.dialogRef.close(this.selectedUserId);
    }
  }
}
