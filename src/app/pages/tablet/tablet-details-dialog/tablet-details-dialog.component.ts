import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TabletMonitorRow, TabletMonitorService } from '../../../services/tablet-monitor.service';

export interface TabletDetailsData {
  row: TabletMonitorRow;
  index: number; // zero-based index for TAB-xxx label
}

@Component({
  selector: 'app-tablet-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tablet-details-dialog.component.html',
})
export class TabletDetailsDialogComponent {
  copying = false;
  working = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TabletDetailsData,
    private dialogRef: MatDialogRef<TabletDetailsDialogComponent>,
    public monitor: TabletMonitorService,
  ) {}

  updateSerial() {
    const value = prompt('Set serial number', this.data.row.serialNumber || '');
    if (value === null) return;
    this.monitor.update(this.data.row.deviceId, { serialNumber: value }).subscribe(() => {
      this.data.row.serialNumber = value;
    });
  }

  updateStorage() {
    const raw = prompt('Set storage (GB)', String(this.data.row.storageGb ?? ''));
    if (raw === null) return;
    const value = Number(raw);
    if (Number.isNaN(value)) return;
    this.monitor.update(this.data.row.deviceId, { storageGb: value }).subscribe(() => {
      this.data.row.storageGb = value;
    });
  }

  updateScreen() {
    const value = prompt('Set screen size (inches)', this.data.row.screenInches || '');
    if (value === null) return;
    this.monitor.update(this.data.row.deviceId, { screenInches: value }).subscribe(() => {
      this.data.row.screenInches = value;
    });
  }

  get tabletId(): string {
    return `TAB-${String(this.data.index + 1).padStart(3, '0')}`;
  }

  async copy(text: string) {
    try {
      this.copying = true;
      await navigator.clipboard.writeText(text);
      setTimeout(() => (this.copying = false), 600);
    } catch {
      this.copying = false;
    }
  }

  async rename() {
    const alias = prompt('Set alias for device', this.data.row.alias || '');
    if (alias === null) return;
    this.working = true;
    this.monitor.update(this.data.row.deviceId, { alias }).subscribe({
      next: () => {
        this.working = false;
        this.data.row.alias = alias;
      },
      error: () => (this.working = false),
    });
  }

  assign() {
    const driverIdStr = prompt('Enter driver ID to assign');
    if (!driverIdStr) return;
    const driverId = Number(driverIdStr);
    if (Number.isNaN(driverId)) return;
    this.working = true;
    this.monitor.assign(this.data.row.deviceId, driverId).subscribe({
      next: () => {
        this.working = false;
        this.data.row.driverId = driverId;
      },
      error: () => (this.working = false),
    });
  }

  unassign() {
    if (!confirm('Unassign driver from this tablet? This will log out the tablet.')) return;
    this.working = true;
    this.monitor.unassign(this.data.row.deviceId).subscribe({
      next: () => {
        this.working = false;
        this.data.row.driverId = undefined;
      },
      error: () => (this.working = false),
    });
  }

  delete() {
    if (!confirm(`Delete device ${this.data.row.deviceId}? This cannot be undone.`)) return;
    this.working = true;
    this.monitor.delete(this.data.row.deviceId).subscribe({
      next: () => {
        this.working = false;
        this.dialogRef.close({ deleted: true });
      },
      error: () => (this.working = false),
    });
  }

  close() {
    this.dialogRef.close();
  }
}


