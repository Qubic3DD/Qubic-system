import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { AdvertisersResponse } from '../../api/Response/AdvertisersResponse';
import { Services } from '../../core/services';



type Filter = {
  id: string;
  label: string;
  active: boolean;
};


@Component({
  selector: 'app-advertiser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advertiser.component.html',
  styleUrl: './advertiser.component.css'
})
export class AdvertiserComponent implements OnInit {
    _baseRequest:BaseRequest = new BaseRequest();
    advertisers: AdvertisersResponse[] = [];
    activeFilter: string = 'all';
  constructor(private router: Router,private _http:RequestSenderService) {}

 
ngOnInit(): void {
  this.getAdvertisers();
}

 
///get advertisers
getAdvertisers() {
  this._http.sendGetRequest<any>(Services.GET_ADVERTISERS, this._baseRequest).subscribe({
    next: (response) => {
      this.advertisers = response.data; 
      console.log("current advertisers", this.advertisers);
    },
    error: (err) => {
      console.error("Error fetching advertisers", err);
    }
  });
}

  addAdvertiser() {
    this.router.navigate(['/advertisers/add']);
  }
  editAdvertiser(userName: string) {
    this.router.navigate(['/advertisers/edit'], { queryParams: { username: userName } });
  }


viewFleetOwnerDetails(userName: string): void {
  this.router.navigate(['/advertisers/details'], {
    queryParams: { username: userName },
  });
}
  toggleFilter(filterId: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    }));
    this.activeFilter = filterId;
  }
  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
    { id: 'pending', label: 'Pending', active: false }
  ];

  getDocumentUrlByUsernameAndPurpose(
    username: string,
    purpose: string
  ): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    return `https://backend.qubic3d.co.za/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }
    getInitials(name: string): string {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}
imageLoadFailed: { [email: string]: boolean } = {};

onImageError(email: string) {
  this.imageLoadFailed[email] = true;
}
}
