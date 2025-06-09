import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabletService } from '../../../services/tablet.service';
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
    private tabletService: TabletService,
    private dialogRef: MatDialogRef<AddTabletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tabletForm = this.fb.group({
      model: ['', Validators.required],
      serialNumber: ['', [Validators.required, Validators.minLength(5)]],
      storage: [''],
      screen: [''],
      os: ['']
    });
  }

  onSubmit() {
    if (this.tabletForm.valid) {
      this.tabletService.createTablet(this.tabletForm.value).subscribe({
        next: (newTablet) => {
          this.dialogRef.close(newTablet);
        },
        error: (err) => {
          console.error('Error creating tablet:', err);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
