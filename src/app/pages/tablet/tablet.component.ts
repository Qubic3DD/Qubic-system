import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tablet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css'],
})
export class TabletComponent {
  searchQuery = '';
  selectedTablet: any = null;
  selectedUser: any = null;

  tablets = [
    {
      id: 1,
      model: 'Samsung Galaxy Tab S8',
      serial: 'SGS8-001',
      owner: 'John Doe',
      assignedDate: new Date('2024-01-15'),
      status: 'Available',
      lastUpdated: new Date(),
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+123456789',
        role: 'Driver',
        department: 'Logistics',
        accessLevel: 'Standard',
      },
      specs: {
        storage: '128GB',
        screen: '11 inch',
        os: 'Android 13',
      },
    },
    {
      id: 2,
      model: 'iPad Pro 12.9"',
      serial: 'IPADPRO-002',
      owner: 'Jane Smith',
      assignedDate: new Date('2024-03-20'),
      status: 'Assigned',
      lastUpdated: new Date(),
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+987654321',
        role: 'Supervisor',
        department: 'Operations',
        accessLevel: 'Admin',
      },
      specs: {
        storage: '256GB',
        screen: '12.9 inch',
        os: 'iPadOS 17',
      },
    },
    {
      id: 3,
      model: 'Lenovo Tab M10',
      serial: 'LENOVO-003',
      owner: '',
      assignedDate: null,
      status: 'Maintenance',
      lastUpdated: new Date(),
      user: null,
      specs: {
        storage: '64GB',
        screen: '10.1 inch',
        os: 'Android 11',
      },
    },
  ];

  get filteredTablets() {
    return this.tablets.filter(
      (tab) =>
        tab.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (tab.owner &&
          tab.owner.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  get availableCount() {
    return this.tablets.filter((t) => t.status === 'Available').length;
  }

  get assignedCount() {
    return this.tablets.filter((t) => t.status === 'Assigned').length;
  }

  get maintenanceCount() {
    return this.tablets.filter((t) => t.status === 'Maintenance').length;
  }

  viewTabletInfo(tablet: any) {
    this.selectedTablet = tablet;
    this.selectedUser = tablet.user || null;
    setTimeout(() => {
      const modal = document.getElementById('tabletModal');
      if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      }
    });
  }

  viewUserInfo(user: any) {
    this.selectedUser = user;
    setTimeout(() => {
      const modal = document.getElementById('userModal');
      if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      }
    });
  }

  addTablet() {
    alert('Add Tablet functionality would open a form popup here.');
  }

  removeTablet(id: number) {
    if (confirm('Are you sure you want to remove this tablet?')) {
      this.tablets = this.tablets.filter((t) => t.id !== id);
    }
  }

  closeModal() {
    this.selectedTablet = null;
    this.selectedUser = null;
    // Optionally hide the modals manually if needed
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach((modal) => {
      const bsModal = bootstrap.Modal.getInstance(modal as HTMLElement);
      bsModal?.hide();
    });
  }
}
