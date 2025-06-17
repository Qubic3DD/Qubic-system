import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponentFleet } from '../../components/sidebar copy 2/sidebar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SidebarComponentFleet, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponentFleet {
 isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
