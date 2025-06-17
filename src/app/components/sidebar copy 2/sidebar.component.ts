import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponentFleet {
  @Input() isCollapsed = false;
  userEmail: string | null = null;
  userName: string | null = null;

  constructor(private router: Router) {
    // Get user info from localStorage when component initializes
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
  }

    viewDriverDetails(): void {
  this.router.navigate(['/fleet-owner-dashboard/details'], {
    queryParams: { username: this.userEmail },
  });
}
    viewDrivers(): void {
  this.router.navigate(['/fleet-owner-dashboard/drivers'], {
    queryParams: { username: this.userEmail },
  });
}
      vegicles(): void {
  this.router.navigate(['fleet-owner-dashboard/vehicles'], {
    queryParams: { username: this.userEmail },
  });
}
      tablets(): void {
  this.router.navigate(['fleet-owner-dashboard/tablets'], {
    queryParams: { username: this.userEmail },
  });
}      finance(): void {
  this.router.navigate(['fleet-owner-dashboard/finance'], {
    queryParams: { username: this.userEmail },
  });
}
      message(): void {
  this.router.navigate(['fleet-owner-dashboard/messages'], {
    queryParams: { username: this.userEmail },
  });
}
  navigate(path: string) {
    this.router.navigate([path]);
  }

}
