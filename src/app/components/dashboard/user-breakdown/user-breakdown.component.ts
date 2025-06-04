// user-breakdown.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-breakdown',
  templateUrl: './user-breakdown.component.html',
  styleUrls: ['./user-breakdown.component.css'],

  imports: [CommonModule],
 
})
export class UserBreakdownComponent {
  @Input() individualUsers: number = 0;
  @Input() companyUsers: number = 0;
  @Input() passengers: number = 0;
  @Input() drivers: number = 0;
  @Input() usersWithMultipleVehicles: number = 0;

  get totalUsers(): number {
    return this.individualUsers + this.companyUsers;
  }
}