import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabletMonitorService } from '../../../services/tablet-monitor.service';
import { CommonModule } from '@angular/common';

@Component({
        imports: [
    CommonModule,
    ReactiveFormsModule,
],
  selector: 'app-add-tablet',
  templateUrl: './add-tablet.component.html',
  styleUrls: ['./add-tablet.component.css'], // Optional, if you want to use styles
})
export class AddTabletComponent {
  tabletForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tabletMonitorService: TabletMonitorService,
    private dialogRef: MatDialogRef<AddTabletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tabletForm = this.fb.group({
      deviceId: ['', [Validators.required, Validators.minLength(3)]],
      alias: ['']
    });
  }

  onSubmit() {
    if (this.tabletForm.invalid) return;
    const { deviceId, alias } = this.tabletForm.value;
    this.tabletMonitorService.register(deviceId, alias).subscribe({
      next: (res) => this.dialogRef.close({ deviceId, alias, res }),
      error: (err) => console.error('Error registering tablet:', err)
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
