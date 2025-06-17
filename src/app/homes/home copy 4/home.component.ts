import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponentAdvertiser } from '../../components/sidebar copy 3/sidebar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SidebarComponentAdvertiser, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponentAdvertiser {
 isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
