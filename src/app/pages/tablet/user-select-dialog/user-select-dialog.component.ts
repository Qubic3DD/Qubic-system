// user-select-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserInfo } from '../../../api/Request/Tablet'; // Adjust path
import { TabletService } from '../../../services/tablet.service';

@Component({
  selector: 'app-user-select-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <div class="mb-4">
        <label for="user-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select User</label>
        <select id="user-select" [(ngModel)]="selectedUserId" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
          <option *ngFor="let user of users" [value]="user.id">{{ user.firstName }} {{ user.lastName }} ({{ user.email }})</option>
        </select>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onConfirm()" [disabled]="!selectedUserId">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class UserSelectDialogComponent {
  users: UserInfo[] = [];
  selectedUserId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<UserSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tabletId?: number },
    private tabletService: TabletService
  ) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.tabletService.getDrivers().subscribe(users => {
      this.users = users;
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