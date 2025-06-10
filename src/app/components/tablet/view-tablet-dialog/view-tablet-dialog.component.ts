import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Tablet, UserInfo } from '../../../api/Request/Tablet';

@Component({
  selector: 'app-view-tablet-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './view-tablet-dialog.component.html',
  styleUrls: ['./view-tablet-dialog.component.css']
})
export class ViewTabletDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewTabletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tablet: Tablet }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
