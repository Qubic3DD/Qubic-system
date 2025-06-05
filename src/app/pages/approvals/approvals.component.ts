import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
    imports: [CommonModule,FormsModule,MatInputModule,MatButtonModule,MatDialogModule,MatCardModule,MatSelectModule,MatIconModule,MatFormFieldModule]
})
export class ApprovalsComponent {
  searchQuery = '';
  filterType = '';
  filteredApplications: any[] = [];
  get totalApplications(): number {
  return this.applications.length;
}

get pendingReviewApplications(): number {
  return this.applications.filter(app => !app.reviewed).length;
}

get approvedTodayApplications(): number {
  return this.applications.filter(app => app.approved && app.approvalDate && this.isToday(app.approvalDate)).length;
}

  applications = [
    {
      id: 1,
      type: 'driver',
      title: 'Driver Application - John Doe',
      description: 'John Doe has applied to become a driver. He has 5 years of experience and a clean driving record.',
      applicantName: 'John Doe',
      submissionDate: new Date('2023-05-15'),
      contactEmail: 'john.doe@example.com',
      reviewed: false,
      approved: false,
      rejected: false,
      notes: '',
      documents: [
        { name: 'Driver License.pdf', url: '#' },
        { name: 'Vehicle Registration.pdf', url: '#' }
      ]
    },
    {
      id: 2,
      type: 'advertiser',
      title: 'Advertiser Application - Acme Corp',
      description: 'Acme Corporation wants to advertise their products on our platform.',
      applicantName: 'Jane Smith (Acme Corp)',
      submissionDate: new Date('2023-05-18'),
      contactEmail: 'jane.smith@acme.com',
      reviewed: true,
      approved: true,
      rejected: false,
      approvalDate: new Date('2023-05-20'),
      notes: 'Approved after reviewing their marketing materials. High quality products.',
      documents: [
        { name: 'Business License.pdf', url: '#' },
        { name: 'Marketing Plan.pdf', url: '#' }
      ]
    },
    {
      id: 3,
      type: 'agency',
      title: 'Agency Application - Star Media',
      description: 'Star Media Agency represents multiple clients who want to advertise.',
      applicantName: 'Michael Johnson (Star Media)',
      submissionDate: new Date('2023-05-20'),
      contactEmail: 'michael@starmedia.com',
      reviewed: false,
      approved: false,
      rejected: false,
      notes: '',
      documents: [
        { name: 'Agency License.pdf', url: '#' },
        { name: 'Client Portfolio.pdf', url: '#' }
      ]
    },
    {
      id: 4,
      type: 'driver',
      title: 'Driver Application - Sarah Williams',
      description: 'Sarah Williams is applying as a part-time driver with flexible hours.',
      applicantName: 'Sarah Williams',
      submissionDate: new Date('2023-05-22'),
      contactEmail: 'sarah.w@example.com',
      reviewed: true,
      approved: false,
      rejected: true,
      rejectionDate: new Date('2023-05-23'),
      notes: 'Rejected due to insufficient driving experience.',
      documents: [
        { name: 'Driver License.pdf', url: '#' },
        { name: 'Background Check.pdf', url: '#' }
      ]
    }
  ];

  selectedApplication: any = null;

  constructor() {
    this.filteredApplications = [...this.applications];
  }

  filterApplications() {
    this.filteredApplications = this.applications.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          app.applicantName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = !this.filterType || app.type === this.filterType;
      return matchesSearch && matchesType;
    });
  }

  refreshApplications() {
    // In a real app, this would fetch fresh data from the server
    this.filterApplications();
  }

  viewApplication(app: any) {
    this.selectedApplication = {...app};
  }

  approveApplication(app: any) {
    app.reviewed = true;
    app.approved = true;
    app.rejected = false;
    app.approvalDate = new Date();
    this.closeModal();
    this.filterApplications();
  }

  rejectApplication(app: any) {
    app.reviewed = true;
    app.approved = false;
    app.rejected = true;
    app.rejectionDate = new Date();
    this.filterApplications();
  }

  deleteApplication(app: any) {
    if (confirm(`Are you sure you want to delete ${app.title}? This action cannot be undone.`)) {
      this.applications = this.applications.filter(a => a.id !== app.id);
      this.filterApplications();
      if (this.selectedApplication && this.selectedApplication.id === app.id) {
        this.closeModal();
      }
    }
  }

  saveNotes(app: any) {
    // In a real app, this would save to the server
    const index = this.applications.findIndex(a => a.id === app.id);
    if (index !== -1) {
      this.applications[index].notes = app.notes;
    }
    alert('Notes saved successfully');
  }

  downloadDocument(doc: any) {
    // In a real app, this would download the document
    console.log(`Downloading ${doc.name}`);
    alert(`Downloading ${doc.name}`);
  }

  closeModal() {
    this.selectedApplication = null;
  }

  getStatusText(app: any): string {
    if (app.approved) return 'Approved';
    if (app.rejected) return 'Rejected';
    return 'Pending Review';
  }

  isToday(date: Date): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
}