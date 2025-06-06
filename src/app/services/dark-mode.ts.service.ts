import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode = false;

  constructor() {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      this.darkMode = savedMode === 'true';
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyMode();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.applyMode();
    return this.darkMode;
  }

  isDarkMode() {
    return this.darkMode;
  }

  private applyMode() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
