import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-stub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-stub.component.html',
  styleUrls: ['./page-stub.component.css']
})
export class PageStubComponent {
  title = '';
  description = '';

  constructor(route: ActivatedRoute) {
    const data = route.snapshot.data || {};
    this.title = data['title'] || 'Page';
    this.description = data['description'] || 'Coming soon';
  }
}


