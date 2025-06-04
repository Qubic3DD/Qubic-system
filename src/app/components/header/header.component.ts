import { Component, EventEmitter, Output } from '@angular/core';
import { DarkModeToggleComponent } from "../dark-mode-toggle/dark-mode-toggle.component";



@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [DarkModeToggleComponent]
})
export class HeaderComponent {
    firstName: string | null = null;
  lastName: string | null = null;
  profilePictureUrl: string | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();

  logo: string = '../assets/img/logo.png';

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
 ngOnInit() {
    // Load from localStorage on init
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.profilePictureUrl = localStorage.getItem('profilePictureUrl');
  }
}