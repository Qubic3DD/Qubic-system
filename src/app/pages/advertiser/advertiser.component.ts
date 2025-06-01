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

}


  //  advertisers = [
  //   {
  //     id:1,
  //     logo: 'https://cdn.sologo.ai/2024/05/08/2405081004049628.jpg?x-oss-process=image/resize,m_lfit,w_800,h_0/format,webp',
  //     name: 'Metro Retail Group',
  //     industry: 'Retail',
  //     email: 'marketing@metroretail.com',
  //     phone: '0664698002',
  //     contact: 'Sarah Johnson',
  //     campaigns: 8,
  //     revenue: 32500,
  //     status: 'Active'
    
  //   },
  //   {
  //     id:2,
  //     logo: 'https://www.logoai.com/uploads/output/2025/03/03/43ec017c8de8a3a36a05c343a452378c.jpg',
  //     name: 'Fusion Foods',
  //     industry: 'Food & Beverage',
  //     email: 'marketing@fusionfoods.com',
  //     phone: '0664698002',
  //     contact: 'Michael Chen',
  //     campaigns: 5,
  //     revenue: 18900,
  //     status: 'Active'
  //   },
  //   {
  //     id:3,
  //     logo: 'https://marketplace.canva.com/EAFaFUz4aKo/3/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-tn1zF-_cG9c.jpg',
  //     name: 'TechStart Inc',
  //     industry: 'Technology',
  //     email: 'ads@techstart.io',
  //     phone: '0664698002',
  //     contact: 'Alex Rivera',
  //     campaigns: 12,
  //     revenue: 67800,
  //     status: 'Pending'
  //   }
  // ];

// type Advertiser = {
//   id: string;
//   name: string;
//   industry: string;
//   email: string;
//   phone: string;
//   contact: string;
//   status: 'Active' | 'Inactive' | 'Pending';
//   campaigns: number;
//   revenue: number;
//   logo: string;
// };





