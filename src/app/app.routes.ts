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
import {AddCampaignComponent} from '../app/pages/campaign/campaign/add-campaign/add-campaign.component'
import {EditProfileComponentComponent} from '../app/pages/driver/edit-profile.component/edit-profile.component.component'
 
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
      { path: 'campaigns/new', component: AddCampaignComponent },
      {
  path: 'campaigns',
  loadComponent: () =>
    import('../app/pages/campaign/campaign.component').then(m => m.CampaignComponent)
},


{
path:'drivers',
loadComponent: () =>
  import('../app/pages/driver/driver.component').then(m  =>  m.DriverComponent)
},


{ path: 'drivers/:id/edit', component: EditProfileComponentComponent },

{
  path: 'campaign/:id',
  loadComponent: () => import('./pages/campaign-details/campaign-details.component').then(m => m.CampaignDetailsComponent)
}

     
    ]
  },
  { path: '**', redirectTo: '' } 
];