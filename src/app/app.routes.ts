import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { DriverComponent } from './pages/driver/driver.component';
import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
import { HomeComponent } from './home/home.component';
import { AddAdvertiserComponent } from './pages/advertiser/add-advertiser/add-advertiser.component';
import { EditAdvertiserComponent } from './pages/advertiser/edit-advertiser/edit-advertiser.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
      { path: 'dashboard', component: DashboardComponent }, 
      { path: 'campaigns', component: CampaignComponent },
      { path: 'drivers', component: DriverComponent },
      { 
        path: 'advertisers', 
        children: [
          { path: '', component: AdvertiserComponent }, 
          { path: 'add', component: AddAdvertiserComponent } ,
          { path: 'edit', component: EditAdvertiserComponent } ,
        ]
      }, 
    ]
  },
  { path: '**', redirectTo: '' } 
];