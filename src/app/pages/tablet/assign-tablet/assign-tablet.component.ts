import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TabletService } from '../../../services/tablet.service';
import { DriverService } from '../../../services/DriverService';
import { UserInfo } from '../../../api/Request/Tablet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-select-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './assign-tablet.component.html',
})
export class UserSelectDialogComponent implements OnInit {
  users: UserInfo[] = [];
  filteredUsers: UserInfo[] = [];
  isLoading = false;
  isAssigning = false;
  searchQuery = '';
  selectedUser: UserInfo | null = null;

  constructor(
    private driverService: DriverService,
    private tabletService: TabletService,
    private dialogRef: MatDialogRef<UserSelectDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tabletId: number }
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Add this method to check if a user is selected
  isSelected(user: UserInfo): boolean {
    return this.selectedUser?.id === user.id;
  }

  trackById(index: number, user: UserInfo): number {
    return user.id || index;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.driverService.fetchDriversd().subscribe({
      next: (drivers) => {
        this.users = drivers;
        this.filteredUsers = [...drivers];
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load drivers', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.firstName?.toLowerCase().includes(query) || 
       user.lastName?.toLowerCase().includes(query) || 
       user.email?.toLowerCase().includes(query) ||
       user.phoneNo?.toLowerCase().includes(query))
    );
  }

  selectUser(user: UserInfo): void {
    this.selectedUser = this.selectedUser?.id === user.id ? null : user;
  }

  onAssign(): void {
    if (this.selectedUser) {
      this.isAssigning = true;
      this.tabletService.assignTablet(this.data.tabletId, this.selectedUser.id!)
        .subscribe({
          next: () => {
            this.dialogRef.close({ success: true, userId: this.selectedUser?.id });
          },
          error: () => {
            this.snackBar.open('Failed to assign tablet', 'Close', { duration: 3000 });
            this.isAssigning = false;
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}