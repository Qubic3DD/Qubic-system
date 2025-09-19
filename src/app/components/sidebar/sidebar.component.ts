import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  adOpsOpen = true;
  crmOpen = false;
  bizOpen = false;
  private currentGroup: 'adOps' | 'crm' | 'biz' | null = 'adOps';

  constructor(private router: Router) {}

  navigate(path: string) {
    const [pathname, query] = path.split('?');
    if (query) {
      const queryParams: Record<string, string> = {};
      query.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        if (k) queryParams[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
      });
      this.router.navigate([pathname], { queryParams });
    } else {
      this.router.navigate([pathname]);
    }
  }

  toggle(group: 'adOps' | 'crm' | 'biz') {
    if (this.currentGroup === group) {
      // Collapse if clicking the already open group
      this.currentGroup = null;
      this.adOpsOpen = false;
      this.crmOpen = false;
      this.bizOpen = false;
      return;
    }
    this.currentGroup = group;
    this.adOpsOpen = group === 'adOps';
    this.crmOpen = group === 'crm';
    this.bizOpen = group === 'biz';
  }
}
