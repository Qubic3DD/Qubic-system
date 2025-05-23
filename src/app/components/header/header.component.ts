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
  @Output() toggleSidebar = new EventEmitter<void>();

  logo: string = '../assets/img/logo.png';

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}