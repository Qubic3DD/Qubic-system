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
import { AddAdminComponent } from './pages/admin/add-advertiser/add-advertiser.component';
import { AddAgenciesComponent } from './pages/agencies/add-advertiser/add-advertiser.component';
import { EditAgenciesComponent } from './pages/agencies/edit-profile.component/edit-profile.component.component';
import { AddPassengerComponent } from './pages/passanger/add-advertiser/add-advertiser.component';
import { EditPassengerComponent } from './pages/passanger/edit-profile.component/edit-profile.component.component';
import { EditFleetProfileComponentComponent } from './pages/fleet-owners/edit-profile.component/edit-profile.component.component';
import { TabletViewComponent } from './pages/tablet/tablet-view.component/tablet-view.component.component';
import { UserSelectDialogComponent } from './pages/tablet/user-select-dialog/user-select-dialog.component';
import { ApplicationDashboardComponent } from './pages/application-dashboard/application-dashboard.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login route (now the landing page)
{ path: '', component: LoginComponent },
  { path: 'application/:email', component: ApplicationDashboardComponent },
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
           {
      path: 'details',
      loadComponent: () =>
        import('./pages/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(
          m => m.ViewAdvertiserComponent
        )
    }
        ],
      },

         {
        path: 'admins',
        children: [
          { path: '', component: AdminComponent },
          { path: 'add', component: AddAdminComponent },
          { path: 'edit', component: EditAdvertiserComponent },

            {
      path: 'details',
      loadComponent: () =>
        import('./pages/admin/view-fleet-owner/view-fleet-owner.component').then(
          m => m.ViewAdminComponent
        )
    }
        ],
      },
        { path: 'messages', component: MessagesComponent },
         { path: 'approvals', component: ApprovalsComponent },
        
    {
        path: 'agencies',
        children: [
          { path: '', component: AgenciesComponent },
          { path: 'add', component: AddAgenciesComponent },
          { path: 'edit', component: EditAgenciesComponent },

          {
      path: 'details',
      loadComponent: () =>
        import('./pages/agencies/view-fleet-owner/view-fleet-owner.component').then(
          m => m.ViewAgencyComponent 
        )
    }
        ],
      },
 {
  path: 'fleet-owners',
  children: [
    { path: '', component: FleetOwnersComponent },
    { path: 'add', component: AddFleetOwnerComponent },
    { path: 'edit', component: EditFleetProfileComponentComponent },
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
    { path: ':id', component: TabletViewComponent },
    {path:'assign',component: UserSelectDialogComponent}
  ],
},

      
             {
        path: 'passenger',
        children: [
          { path: '', component: PassengerComponent },
          { path: 'add', component: AddPassengerComponent },
          { path: 'edit', component: EditPassengerComponent },
          {
      path: 'details',
      loadComponent: () =>
        import('./pages/passanger/view-fleet-owner/view-fleet-owner.component').then(
          m => m.ViewPassengerComponent  
        )
    }
        ],
      },
  

      {
        path: 'drivers',
        children: [
          { path: '', component: DriverComponent },
          { path: 'add', component: AddDriverComponent },
          { path: 'edit', component: EditAdvertiserComponent },
             {
        path: 'details',
        loadComponent: () =>
          import('../app/pages/driver/view-fleet-owner/view-fleet-owner.component').then(
            (m) => m.DriverProfileComponent
          ),
      },
        ],
      },

      {
  path: 'approvals/:id',
  loadComponent: () =>
    import('../app/pages/approvals/view-application.component/view-application.component.component').then(
      m => m.ViewApplicationComponent
    )
},


    ],
  },
  { path: '**', redirectTo: '' },
];
