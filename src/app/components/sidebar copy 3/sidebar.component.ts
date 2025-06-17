import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponentAdvertiser {
  @Input() isCollapsed = false;
  userEmail: string | null = null;
  userName: string | null = null;

  constructor(private router: Router) {
    // Get user info from localStorage when component initializes
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
  }
    viewcampaigns(): void {
  this.router.navigate(['/advertiser-dashboard/campaigns'], {
    queryParams: { username: this.userEmail },
  });
}
      profile(): void {
  this.router.navigate(['advertiser-dashboard/details'], {
    queryParams: { username: this.userEmail },
  });
}
      message(): void {
  this.router.navigate(['advertiser-dashboard/messages'], {
    queryParams: { username: this.userEmail },
  });
}
  navigate(path: string) {
    this.router.navigate([path]);
  }
}
