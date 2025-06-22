
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-app-document-viewer',
  imports: [MatIcon,CommonModule],

  template: `
    <div class="document-viewer-container">
      <div class="document-header">
        <h2>{{ data.title }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="document-content">
        <ng-container *ngIf="data.fileType === 'PDF'">
          <iframe [src]="data.url" width="100%" height="100%" frameborder="0"></iframe>
        </ng-container>
        
        <ng-container *ngIf="data.fileType === 'IMAGE'">
          <img [src]="data.url" alt="Document" class="document-image">
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .document-viewer-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .document-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }
    .document-content {
      flex: 1;
      overflow: auto;
    }
    .document-image {
      max-width: 100%;
      max-height: calc(90vh - 80px);
      display: block;
      margin: 0 auto;
    }
  `]
})
export class AppDocumentViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string;
    url: SafeResourceUrl;
    fileType: string;
  }) {}

  close(): void {
    // This will be handled by the dialog
  }
}