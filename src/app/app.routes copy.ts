import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';


import { LoginComponent } from './auth/login/login.component';
import { ApplicationDashboardComponent } from './components/application-dashboard/application-dashboard.component';
import { TrackApplicationComponent } from './pages/application-tracking-component/application-tracking-component.component';

// Admin

import { AdminComponent } from './pages/admin/admin.component';
import { AddAdminComponent } from './pages/admin/add-advertiser/add-advertiser.component';
import { EditAdvertiserComponent } from './pages/advertiser/edit-advertiser/edit-advertiser.component';

// Advertiser

import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
import { AddAdvertiserComponent } from './pages/advertiser/add-advertiser/add-advertiser.component';

// Agency

import { AgenciesComponent } from './pages/agencies/agencies.component';
import { AddAgenciesComponent } from './pages/agencies/add-advertiser/add-advertiser.component';
import { EditAgenciesComponent } from './pages/agencies/edit-profile.component/edit-profile.component.component';


import { FleetOwnersComponent } from './pages/fleet-owners/fleet-owners.component';
import { AddFleetOwnerComponent } from './pages/fleet-owners/add-fleet-owner/add-fleet-owner.component';
import { EditFleetProfileComponentComponent } from './pages/fleet-owners/edit-profile.component/edit-profile.component.component';


import { PassengerComponent } from './pages/passanger/passanger.component';
import { AddPassengerComponent } from './pages/passanger/add-advertiser/add-advertiser.component';
import { EditPassengerComponent } from './pages/passanger/edit-profile.component/edit-profile.component.component';


import { DriverComponent } from './pages/driver/driver.component';
import { AddDriverComponent } from './pages/driver/add-driver/add-driver.component';
import { EditProfileComponentComponent } from './pages/driver/edit-profile.component/edit-profile.component.component';


import { TabletComponent } from './pages/tablet/tablet.component';
import { TabletViewComponent } from './pages/tablet/tablet-view.component/tablet-view.component.component';
import { UserSelectDialogComponent } from './pages/tablet/user-select-dialog/user-select-dialog.component';

// Shared
import { MessagesComponent } from './pages/messages/messages.component';
import { ApprovalsComponent } from './pages/approvals/approvals.component';
import { HomeComponentAgency } from './homes/home copy 3/home.component';
import { HomeComponentAdvertiser } from './homes/home copy 4/home.component';
import { HomeComponentDriver } from './homes/home copy/home.component';
import { RolesConfig } from './services/roles.config';
import { HomeComponentFleet } from './homes/home copy 2/home.component';
import { MessagesComponentDriver } from './pages-dash/messages/messages.component';
import { MessagesComponentFleet } from './pages-fleet-owner/messages/messages.component';
import { MessagesComponentAdvertiser } from './pagess-advertiser/messages/messages.component';
import { AddCampaignComponent } from './pagess-advertiser/campaign/campaign/add-campaign/add-campaign.component';
import { CampaignEditComponent } from './pagess-advertiser/camapign-edit/camapign-edit.component';
import { AddDriverDialogComponent } from './pages-fleet-owner/fleet-owners/add-driver-dialog/add-driver-dialog.component';
import { DriverDetailsDialogComponent } from './pages/fleet-owners/driver-details-dialog/driver-details-dialog.component';
import { DriverComponentFleet } from './pages-fleet-owner/driver/driver.component';
import { AddDriverComponentFleet } from './pages-fleet-owner/driver/add-driver/add-driver.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
// Correct route definition
{ path: 'application-dashboard', component: ApplicationDashboardComponent },
{ path: 'application-dashboard-track/:email', component: TrackApplicationComponent },


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

  // DRIVER
  {
    path: RolesConfig.DRIVER.path,
    component: HomeComponentDriver,
    canActivate: [authGuard],
    data: { roles: [RolesConfig.DRIVER.role] },
    children: [
      { path: '', component: DriverComponent },
      { path: 'add', component: AddDriverComponent },
      { path: 'edit', component: EditAdvertiserComponent },
           { path: 'messages', component: MessagesComponentDriver },
      {
        path: 'details',
        loadComponent: () =>
          import('./pages-dash/driver/view-fleet-owner/view-fleet-owner.component').then(m => m.ViewDriverProfile),
      },
    ]
  },

  // FLEET OWNER
{
  path: RolesConfig.FLEET_OWNER.path, // 'fleet-owner-dashboard'
  component: HomeComponentFleet,
  canActivate: [authGuard],
  data: { roles: [RolesConfig.FLEET_OWNER.role] },
  children: [
    { path: '', component: FleetOwnersComponent },

    { path: 'add', component: AddDriverComponentFleet },
    { path: 'edit/:id', component: EditFleetProfileComponentComponent },
    
    { path: 'drivers', component: DriverComponentFleet },

    // { path: 'vehicles', component: FleetVehiclesComponent }, // ADD THIS
    // { path: 'tablets', component: FleetTabletsComponent },   // ADD THIS
    // { path: 'finance', component: FleetFinanceComponent },   // ADD THIS
    { path: 'messages', component: MessagesComponentFleet },

    {
      path: 'details',
      loadComponent: () =>
        import('./pages-fleet-owner/fleet-owners/view-fleet-owner/view-fleet-owner.component')
        .then(m => m.ViewFleetOwnerComponent),
    },
    {
      path: 'driver-details',
      loadComponent: () =>
        import('./pages-fleet-owner/fleet-owners/view-fleet-owner/view-fleet-owner.component')
        .then(m => m.ViewFleetOwnerComponent),
    },
  ]
},


  // // ADMIN
  // {
  //   path: RolesConfig.ADMIN.path,
  //   component: HomeComponentAD,
  //   canActivate: [authGuard],
  //   data: { roles: [RolesConfig.ADMIN.role] },
  //   children: [
  //     { path: '', component: AdminComponent },
  //     { path: 'add', component: AddAdminComponent },
  //     { path: 'edit', component: EditAdvertiserComponent },
  //     {
  //       path: 'details',
  //       loadComponent: () =>
  //         import('./pages/admin/view-fleet-owner/view-fleet-owner.component').then(m => m.ViewAdminComponent),
  //     },
  //   ]
  // },

  // ADVERTISER
  {
    path: RolesConfig.ADVERTISER.path,
    component: HomeComponentAdvertiser,
    canActivate: [authGuard],
    data: { roles: [RolesConfig.ADVERTISER.role] },
    children: [
      { path: '', component: AdvertiserComponent },

      { path: 'edit/:id', component: CampaignEditComponent },
           { path: 'messages', component: MessagesComponentAdvertiser },
            { path: 'add', component: AddCampaignComponent },
            
                 {
                   path: 'view-campaign/:id',
                   loadComponent: () =>
                     import('./pagess-advertiser/campaign-details/campaign-details.component').then(
                       (m) => m.CampaignDetailsComponent
                     ),
                 },
                 {
                   path: 'campaigns',
                   loadComponent: () =>
                     import('./pagess-advertiser/campaign/campaign.component').then(
                       (m) => m.CampaignComponentAdvertiser
                     ),
                 },
           
      {
        path: 'details',
        loadComponent: () =>
          import('./pagess-advertiser/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(m => m.ViewAdvertiserComponentDetatils),
      },
    ]
  },

  // AGENCY
  {
    path: RolesConfig.AGENCY.path,
    component: HomeComponentAgency,
    canActivate: [authGuard],
    data: { roles: [RolesConfig.AGENCY.role] },
    children: [
      { path: '', component: AgenciesComponent },
      { path: 'add', component: AddAgenciesComponent },
      { path: 'edit', component: EditAgenciesComponent },
           { path: 'messages', component: MessagesComponentAdvertiser },
      {
        path: 'details',
        loadComponent: () =>
          import('./pages/agencies/view-fleet-owner/view-fleet-owner.component').then(m => m.ViewAgencyComponent),
      },
    ]
  },

  // // PASSENGER
  // {
  //   path: RolesConfig.PASSENGER.path,
  //   component: HomeComponentPassenger,
  //   canActivate: [authGuard],
  //   data: { roles: [RolesConfig.PASSENGER.role] },
  //   children: [
  //     { path: '', component: PassengerComponent },
  //     { path: 'add', component: AddPassengerComponent },
  //     { path: 'edit', component: EditPassengerComponent },
  //     {
  //       path: 'details',
  //       loadComponent: () =>
  //         import('./pages/passanger/view-fleet-owner/view-fleet-owner.component').then(m => m.ViewPassengerComponent),
  //     },
  //   ]
  // },

  // // TABLET USER
  // {
  //   path: RolesConfig.TABLET_USER.path,
  //   component: HomeComponentTabletUser,
  //   canActivate: [authGuard],
  //   data: { roles: [RolesConfig.TABLET_USER.role] },
  //   children: [
  //     { path: '', component: TabletComponent },
  //     { path: ':id', component: TabletViewComponent },
  //     { path: 'assign', component: UserSelectDialogComponent },
  //   ]
  // },

  // OTHER SHARED ROUTES
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'approvals',
    component: ApprovalsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'approvals/:id',
    loadComponent: () =>
      import('./pages/approvals/view-application.component/view-application.component.component').then(m => m.ViewApplicationComponent),
    canActivate: [authGuard]
  },

  // FALLBACK
  { path: '**', redirectTo: '' }
];





