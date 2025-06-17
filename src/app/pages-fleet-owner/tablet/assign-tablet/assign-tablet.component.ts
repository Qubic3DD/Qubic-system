import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TabletService } from '../../../services/tablet.service';
import { DriverService } from '../../../services/DriverService';  // <- import driver service
import { UserInfo } from '../../../api/Request/Tablet'; // keep if UserInfo is compatible or change to DriverProfile
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-select-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './assign-tablet.component.html',
  styleUrls: ['./assign-tablet.component.css']
})
export class UserSelectDialogComponent implements OnInit {
  users: UserInfo[] = [];  // or DriverProfile[] if you prefer
  filteredUsers: UserInfo[] = [];
  isLoading = false;
  searchQuery = '';
  selectedUser: UserInfo | null = null;

  constructor(
    private driverService: DriverService,  // changed from userService
    private tabletService: TabletService,
    private dialogRef: MatDialogRef<UserSelectDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tabletId: number }
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.driverService.fetchDriversd().subscribe({
      next: (drivers) => {
        this.users = drivers;  // assign drivers as users
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
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        (user.firstName?.toLowerCase().includes(query) || 
         user.lastName?.toLowerCase().includes(query) || 
         user.email?.toLowerCase().includes(query) ||
         user.phoneNo?.toLowerCase().includes(query))
      );
    }
  }
trackById(index: number, user: any): number {
  return user.id;
}

  selectUser(user: UserInfo): void {
    this.selectedUser = user;
  }

  onAssign(): void {
    if (this.selectedUser) {
      this.isLoading = true;
      this.tabletService.assignTablet(this.data.tabletId, this.selectedUser.id!)
        .subscribe({
          next: (updatedTablet) => {
            this.dialogRef.close(updatedTablet);
            this.snackBar.open('Tablet assigned successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to assign tablet', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
