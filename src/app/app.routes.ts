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
import { AgenciesComponent } from './pages/agencies/agencies.component';
import { FleetOwnersComponent } from './pages/fleet-owners/fleet-owners.component';
import {  PassengerComponent } from './pages/passanger/passanger.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ApprovalsComponent } from './pages/approvals/approvals.component';
import { TabletComponent } from './pages/tablet/tablet.component';
import { AddFleetOwnerComponent } from './pages/fleet-owners/add-fleet-owner/add-fleet-owner.component';
import { ViewFleetOwnerComponent } from './pages/fleet-owners/view-fleet-owner/view-fleet-owner.component';
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
        path: 'admins',
        children: [
          { path: '', component: AdminComponent },
          // { path: 'add', component: AddAdvertiserComponent },
          // { path: 'edit', component: EditAdvertiserComponent },
        ],
      },
        { path: 'messages', component: MessagesComponent },
         { path: 'approvals', component: ApprovalsComponent },
        
    {
        path: 'agencies',
        children: [
          { path: '', component: AgenciesComponent },
          // { path: 'add', component: AddAgenciesComponent },
          // { path: 'edit', component: EditAgenciesComponent },
        ],
      },
 {
  path: 'fleet-owners',
  children: [
    { path: '', component: FleetOwnersComponent },
    { path: 'add', component: AddFleetOwnerComponent },
    {
      path: 'details',
      loadComponent: () =>
        import('./pages/fleet-owners/view-fleet-owner/view-fleet-owner.component').then(
          m => m.ViewFleetOwnerComponent
        )
    }
  ],
}
,
            {
        path: 'tablets',
        children: [
          { path: '', component: TabletComponent },
          // { path: 'add', component: AddAgenciesComponent },
          // { path: 'edit', component: EditAgenciesComponent },
        ],
      },
      
             {
        path: 'passenger',
        children: [
          { path: '', component: PassengerComponent },
          // { path: 'add', component: AddAgenciesComponent },
          // { path: 'edit', component: EditAgenciesComponent },
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
