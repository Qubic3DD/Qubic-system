// src/app/shared/confirm-dialog.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  confirm(title: string, message: string): Promise<boolean> {
    const confirmation = window.confirm(`${title}\n\n${message}`);
    return Promise.resolve(confirmation);
  }
}
