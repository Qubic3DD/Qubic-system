import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { Tablet, UserInfo } from '../../api/Request/Tablet'; // Adjust import path
import { TabletService } from '../../services/tablet.service';
import { TabletMonitorService, TabletMonitorRow } from '../../services/tablet-monitor.service';
import { AssignmentEventsService } from '../../services/assignment-events.service';
import { TabletDetailsDialogComponent } from './tablet-details-dialog/tablet-details-dialog.component';
import { AddTabletComponent } from './add-tablet/add-tablet.component'; // Adjust path if needed
import { UserSelectDialogComponent } from './user-select-dialog/user-select-dialog.component';
import { TabletViewComponent } from './tablet-view.component/tablet-view.component.component';

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
export class TabletComponent implements OnInit, OnDestroy {
  searchQuery = '';
  selectedTablet: Tablet | null = null;
  selectedUser: UserInfo | null = null;
  activeDropdown: number | null = null;
  tablets: Tablet[] = [];
  isLoading = false;
  error: string | null = null;

  // Live monitor
  monitorRows: TabletMonitorRow[] = [];
  monitorLoading = false;
  monitorError: string | null = null;
  private monitorTimer: any = null;
  showDeviceId = false; // hidden by default

  // Count properties
  availableCount = 0;
  assignedCount = 0;
  maintenanceCount = 0; // used as Offline count in UI
  onlineCount = 0;

  constructor(
    private tabletService: TabletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private tabletMonitorService: TabletMonitorService,
    private assignmentEvents: AssignmentEventsService,
  ) {}

  ngOnInit(): void {
    this.loadTablets();
    this.loadMonitor();
    this.startMonitorAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
      this.monitorTimer = null;
    }
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
    // Compute counts from live monitor data
    this.availableCount = this.monitorRows.filter(r => r.driverId == null).length;
    this.assignedCount = this.monitorRows.filter(r => r.driverId != null).length;
    this.maintenanceCount = this.monitorRows.filter(r => r.online === false).length;
    this.onlineCount = this.monitorRows.filter(r => r.online === true).length;
  }

  loadMonitor(): void {
    this.monitorLoading = true;
    this.tabletMonitorService.getMonitor()
      .pipe(finalize(() => this.monitorLoading = false))
      .subscribe({
        next: (res) => {
          const data = res?.data ?? [];
          this.monitorRows = data.map((row, idx) => ({
            ...row,
            // Add display Tablet ID like TAB-001
            // We'll not store it on the object; compute in template via index
          }));
          // Fetch impressions for each device (best-effort)
          this.monitorRows.forEach((r, i) => {
            this.tabletMonitorService.getImpressions(r.deviceId).subscribe({
              next: (count) => this.monitorRows[i].impressions = count,
              error: () => {}
            });
          });
          this.updateCounts();
        },
        error: () => this.monitorError = 'Failed to load monitor'
      });
  }

  startMonitorAutoRefresh(intervalMs: number = 30000): void {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
    }
    this.monitorTimer = setInterval(() => this.loadMonitor(), intervalMs);
  }

  // Monitor actions
  renameMonitor(row: TabletMonitorRow): void {
    const alias = prompt('Set alias for device', row.alias || '');
    if (alias === null) return;
    this.tabletMonitorService.register(row.deviceId, alias).subscribe({
      next: () => {
        this.snackBar.open('Alias updated', 'Close', { duration: 2000 });
        this.loadMonitor();
      },
      error: () => this.snackBar.open('Failed to update alias', 'Close', { duration: 3000 })
    });
  }

  assignMonitor(row: TabletMonitorRow): void {
    const dialogRef = this.dialog.open(UserSelectDialogComponent, {
      width: '600px',
      data: { title: 'Assign Tablet', deviceId: row.deviceId }
    });
    dialogRef.afterClosed().subscribe((userId: number) => {
      if (userId) {
        this.snackBar.open('Assigned', 'Close', { duration: 2000 });
        this.assignmentEvents.emit({ action: 'assign', driverId: userId, deviceId: row.deviceId });
        this.loadMonitor();
      }
    });
  }

  unassignMonitor(row: TabletMonitorRow): void {
    if (!confirm('Unassign driver from this tablet? This will log out the tablet.')) return;
    this.tabletMonitorService.unassign(row.deviceId).subscribe({
      next: () => {
        this.snackBar.open('Unassigned and tablet will log out shortly', 'Close', { duration: 2000 });
        this.loadMonitor();
      },
      error: () => this.snackBar.open('Failed to unassign', 'Close', { duration: 3000 })
    });
  }

  deleteMonitor(row: TabletMonitorRow): void {
    if (!confirm(`Delete device ${row.deviceId}? This cannot be undone.`)) return;
    this.tabletMonitorService.delete(row.deviceId).subscribe({
      next: () => {
        this.snackBar.open('Tablet deleted', 'Close', { duration: 2000 });
        this.loadMonitor();
      },
      error: () => this.snackBar.open('Failed to delete tablet', 'Close', { duration: 3000 })
    });
  }

  openDetails(row: TabletMonitorRow, index: number): void {
    const dialogRef = this.dialog.open(TabletDetailsDialogComponent, {
      data: { row, index },
      width: '90vw',
      maxWidth: '920px',
      panelClass: 'tablet-details-dialog',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.deleted) {
        this.loadMonitor();
      }
    });
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
  const dialogRef = this.dialog.open(TabletViewComponent, {
    width: '70vw',      // full viewport width
    height: '80vh',     // full viewport height
    maxWidth: '80vw',   // override maxWidth limit (default is 80vw)
    maxHeight: '800vh',  // override maxHeight limit
    panelClass: 'full-screen-dialog',  // optional, for extra styling if needed
    data: { tabletId: tablet.id }
  });

  dialogRef.afterClosed().subscribe((result: Tablet | undefined) => {
    if (result) {
      this.refreshTabletList();
      this.snackBar.open('Tablet updated successfully!', 'Close', { duration: 3000 });
      console.log('Tablet updated:', result);
    }
  });
}


viewUserInfo(user: UserInfo): void {
  this.selectedUser = user;
  this.selectedTablet = null; // Clear any previous tablet selection
}

  addTablet(): void {
    const dialogRef = this.dialog.open(AddTabletComponent, {
      width: '480px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadMonitor();
        this.snackBar.open('Tablet registered successfully!', 'Close', { duration: 3000 });
        console.log('Tablet registered:', result);
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
    width: '600px',
    data: { title: 'Assign Tablet', tabletId: tablet.id ,tablet: tablet }
  });

  dialogRef.afterClosed().subscribe((result: Tablet | undefined) => {
    if (result) {
      this.refreshTabletList();
      this.snackBar.open('Tablet updated successfully!', 'Close', { duration: 3000 });
      console.log('Tablet updated:', result);
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
