import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
import { HomeComponent } from './home/home.component';
import { AddAdvertiserComponent } from './pages/advertiser/add-advertiser/add-advertiser.component';
import { EditAdvertiserComponent } from './pages/advertiser/edit-advertiser/edit-advertiser.component';
import { authGuard } from './auth/auth.guard';
import { AddCampaignComponent } from '../app/pages/campaign/campaign/add-campaign/add-campaign.component';
import { EditProfileComponentComponent } from '../app/pages/driver/edit-profile.component/edit-profile.component.component';
import { AddDriverComponent } from '../app/pages/driver/add-driver/add-driver.component';
import { DriverComponent } from './pages/driver/driver.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login route (now the landing page)
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'campaigns/new', component: AddCampaignComponent },
      {
        path: 'campaign/:id',
        loadComponent: () =>
          import('./pages/campaign-details/campaign-details.component').then(
            (m) => m.CampaignDetailsComponent
          ),
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./pages/campaign/campaign.component').then(
            (m) => m.CampaignComponent
          ),
      },

      { path: 'drivers/edit/:email', component: EditProfileComponentComponent },
      {
        path: 'advertisers',
        children: [
          { path: '', component: AdvertiserComponent },
          { path: 'add', component: AddAdvertiserComponent },
          { path: 'edit', component: EditAdvertiserComponent },
        ],
      },
      {
        path: 'drivers',
        children: [
          { path: '', component: DriverComponent },
          { path: 'add', component: AddDriverComponent },
          { path: 'edit', component: EditAdvertiserComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
