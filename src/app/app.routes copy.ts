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
  { path: 'application-dashboard/:email', component: ApplicationDashboardComponent },
{ path: 'application-dashboard', component: ApplicationDashboardComponent },
{ path: 'application-dashboard/:email', component: ApplicationDashboardComponent },



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

// import { Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
// import { HomeComponent } from './homes/home/home.component';
// import { AddAdvertiserComponent } from './pages/advertiser/add-advertiser/add-advertiser.component';
// import { EditAdvertiserComponent } from './pages/advertiser/edit-advertiser/edit-advertiser.component';
// import { authGuard } from './auth/auth.guard';
// import { AddCampaignComponent } from '../app/pages/campaign/campaign/add-campaign/add-campaign.component';
// import { EditProfileComponentComponent } from '../app/pages/driver/edit-profile.component/edit-profile.component.component';
// import { AddDriverComponent } from '../app/pages/driver/add-driver/add-driver.component';
// import { DriverComponent } from './pages/driver/driver.component';
// import { AgenciesComponent } from './pages/agencies/agencies.component';
// import { FleetOwnersComponent } from './pages/fleet-owners/fleet-owners.component';
// import {  PassengerComponent } from './pages/passanger/passanger.component';
// import { MessagesComponent } from './pages/messages/messages.component';
// import { AdminComponent } from './pages/admin/admin.component';
// import { ApprovalsComponent } from './pages/approvals/approvals.component';
// import { TabletComponent } from './pages/tablet/tablet.component';
// import { AddFleetOwnerComponent } from './pages/fleet-owners/add-fleet-owner/add-fleet-owner.component';
// import { AddAdminComponent } from './pages/admin/add-advertiser/add-advertiser.component';
// import { AddAgenciesComponent } from './pages/agencies/add-advertiser/add-advertiser.component';
// import { EditAgenciesComponent } from './pages/agencies/edit-profile.component/edit-profile.component.component';
// import { AddPassengerComponent } from './pages/passanger/add-advertiser/add-advertiser.component';
// import { EditPassengerComponent } from './pages/passanger/edit-profile.component/edit-profile.component.component';
// import { EditFleetProfileComponentComponent } from './pages/fleet-owners/edit-profile.component/edit-profile.component.component';
// import { TabletViewComponent } from './pages/tablet/tablet-view.component/tablet-view.component.component';
// import { UserSelectDialogComponent } from './pages/tablet/user-select-dialog/user-select-dialog.component';
// import { ApplicationDashboardComponent } from './pages/application-dashboard/application-dashboard.component';
// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   // Login route (now the landing page)
// { path: '', component: LoginComponent },
//   { path: 'application/:email', component: ApplicationDashboardComponent },
//   {
//     path: '',
//     component: HomeComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: 'dashboard', component: DashboardComponent },
//       { path: 'campaigns/new', component: AddCampaignComponent },
 
//       {
//         path: 'campaign/:id',
//         loadComponent: () =>
//           import('./pages/campaign-details/campaign-details.component').then(
//             (m) => m.CampaignDetailsComponent
//           ),
//       },
//       {
//         path: 'campaigns',
//         loadComponent: () =>
//           import('./pages/campaign/campaign.component').then(
//             (m) => m.CampaignComponent
//           ),
//       },

//       { path: 'drivers/edit/:email', component: EditProfileComponentComponent },
//       {
//         path: 'advertisers',
//         children: [
//           { path: '', component: AdvertiserComponent },
//           { path: 'add', component: AddAdvertiserComponent },
//           { path: 'edit', component: EditAdvertiserComponent },
//            {
//       path: 'details',
//       loadComponent: () =>
//         import('./pages/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(
//           m => m.ViewAdvertiserComponent
//         )
//     }
//         ],
//       },

//          {
//         path: 'admins',
//         children: [
//           { path: '', component: AdminComponent },
//           { path: 'add', component: AddAdminComponent },
//           { path: 'edit', component: EditAdvertiserComponent },

//             {
//       path: 'details',
//       loadComponent: () =>
//         import('./pages/admin/view-fleet-owner/view-fleet-owner.component').then(
//           m => m.ViewAdminComponent
//         )
//     }
//         ],
//       },
//         { path: 'messages', component: MessagesComponent },
//          { path: 'approvals', component: ApprovalsComponent },
        
//     {
//         path: 'agencies',
//         children: [
//           { path: '', component: AgenciesComponent },
//           { path: 'add', component: AddAgenciesComponent },
//           { path: 'edit', component: EditAgenciesComponent },

//           {
//       path: 'details',
//       loadComponent: () =>
//         import('./pages/agencies/view-fleet-owner/view-fleet-owner.component').then(
//           m => m.ViewAgencyComponent 
//         )
//     }
//         ],
//       },
//  {
//   path: 'fleet-owners',
//   children: [
//     { path: '', component: FleetOwnersComponent },
//     { path: 'add', component: AddFleetOwnerComponent },
//     { path: 'edit', component: EditFleetProfileComponentComponent },
//     {
//       path: 'details',
//       loadComponent: () =>
//         import('./pages/fleet-owners/view-fleet-owner/view-fleet-owner.component').then(
//           m => m.ViewFleetOwnerComponent
//         )
//     }
//   ],
// }
// ,
//  {
//   path: 'tablets',
//   children: [
//     { path: '', component: TabletComponent },
//     { path: ':id', component: TabletViewComponent },
//     {path:'assign',component: UserSelectDialogComponent}
//   ],
// },

      
//              {
//         path: 'passenger',
//         children: [
//           { path: '', component: PassengerComponent },
//           { path: 'add', component: AddPassengerComponent },
//           { path: 'edit', component: EditPassengerComponent },
//           {
//       path: 'details',
//       loadComponent: () =>
//         import('./pages/passanger/view-fleet-owner/view-fleet-owner.component').then(
//           m => m.ViewPassengerComponent  
//         )
//     }
//         ],
//       },
  

//       {
//         path: 'drivers',
//         children: [
//           { path: '', component: DriverComponent },
//           { path: 'add', component: AddDriverComponent },
//           { path: 'edit', component: EditAdvertiserComponent },
//              {
//         path: 'details',
//         loadComponent: () =>
//           import('../app/pages/driver/view-fleet-owner/view-fleet-owner.component').then(
//             (m) => m.DriverProfileComponent
//           ),
//       },
//         ],
//       },

//       {
//   path: 'approvals/:id',
//   loadComponent: () =>
//     import('../app/pages/approvals/view-application.component/view-application.component.component').then(
//       m => m.ViewApplicationComponent
//     )
// },


//     ],
//   },
//   { path: '**', redirectTo: '' },
// ];


// // import { Routes } from '@angular/router';
// // import { LoginComponent } from './auth/login/login.component';
// // import { DashboardComponent } from './components/dashboard/dashboard.component';
// // import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
// // import { HomeComponent } from './homes/home/home.component';
// // import { AddAdvertiserComponent } from './pages/advertiser/add-advertiser/add-advertiser.component';
// // import { EditAdvertiserComponent } from './pages/advertiser/edit-advertiser/edit-advertiser.component';
// // import { authGuard } from './auth/auth.guard';
// // import { AddCampaignComponent } from '../app/pages/campaign/campaign/add-campaign/add-campaign.component';
// // import { EditProfileComponentComponent } from '../app/pages/driver/edit-profile.component/edit-profile.component.component';
// // import { AddDriverComponent } from '../app/pages/driver/add-driver/add-driver.component';
// // import { DriverComponent } from './pages/driver/driver.component';
// // import { AgenciesComponent } from './pages/agencies/agencies.component';
// // import { FleetOwnersComponent } from './pages/fleet-owners/fleet-owners.component';
// // import {  PassengerComponent } from './pages/passanger/passanger.component';
// // import { MessagesComponent } from './pages/messages/messages.component';
// // import { AdminComponent } from './pages/admin/admin.component';
// // import { ApprovalsComponent } from './pages/approvals/approvals.component';
// // import { TabletComponent } from './pages/tablet/tablet.component';
// // import { AddFleetOwnerComponent } from './pages/fleet-owners/add-fleet-owner/add-fleet-owner.component';
// // import { AddAdminComponent } from './pages/admin/add-advertiser/add-advertiser.component';
// // import { AddAgenciesComponent } from './pages/agencies/add-advertiser/add-advertiser.component';
// // import { EditAgenciesComponent } from './pages/agencies/edit-profile.component/edit-profile.component.component';
// // import { AddPassengerComponent } from './pages/passanger/add-advertiser/add-advertiser.component';
// // import { EditPassengerComponent } from './pages/passanger/edit-profile.component/edit-profile.component.component';
// // import { EditFleetProfileComponentComponent } from './pages/fleet-owners/edit-profile.component/edit-profile.component.component';
// // import { TabletViewComponent } from './pages/tablet/tablet-view.component/tablet-view.component.component';
// // import { UserSelectDialogComponent } from './pages/tablet/user-select-dialog/user-select-dialog.component';
// // import { ApplicationDashboardComponent } from './pages/application-dashboard/application-dashboard.component';
// // export const routes: Routes = [
// //   { path: '', redirectTo: 'login', pathMatch: 'full' },

// //   // Login route (now the landing page)
// // { path: '', component: LoginComponent },
// //   { path: 'application/:email', component: ApplicationDashboardComponent },
// //   {
// //     path: '',
// //     component: HomeComponent,
// //     canActivate: [authGuard],
// //     children: [
// //       { path: 'dashboard', component: DashboardComponent },
// //       { path: 'campaigns/new', component: AddCampaignComponent },
 
// //       {
// //         path: 'campaign/:id',
// //         loadComponent: () =>
// //           import('./pages/campaign-details/campaign-details.component').then(
// //             (m) => m.CampaignDetailsComponent
// //           ),
// //       },
// //       {
// //         path: 'campaigns',
// //         loadComponent: () =>
// //           import('./pages/campaign/campaign.component').then(
// //             (m) => m.CampaignComponent
// //           ),
// //       },

// //       { path: 'drivers/edit/:email', component: EditProfileComponentComponent },
// //       {
// //         path: 'advertisers',
// //         children: [
// //           { path: '', component: AdvertiserComponent },
// //           { path: 'add', component: AddAdvertiserComponent },
// //           { path: 'edit', component: EditAdvertiserComponent },
// //            {
// //       path: 'details',
// //       loadComponent: () =>
// //         import('./pages/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(
// //           m => m.ViewAdvertiserComponent
// //         )
// //     }
// //         ],
// //       },

// //          {
// //         path: 'admins',
// //         children: [
// //           { path: '', component: AdminComponent },
// //           { path: 'add', component: AddAdminComponent },
// //           { path: 'edit', component: EditAdvertiserComponent },

// //             {
// //       path: 'details',
// //       loadComponent: () =>
// //         import('./pages/admin/view-fleet-owner/view-fleet-owner.component').then(
// //           m => m.ViewAdminComponent
// //         )
// //     }
// //         ],
// //       },
// //         { path: 'messages', component: MessagesComponent },
// //          { path: 'approvals', component: ApprovalsComponent },
        
// //     {
// //         path: 'agencies',
// //         children: [
// //           { path: '', component: AgenciesComponent },
// //           { path: 'add', component: AddAgenciesComponent },
// //           { path: 'edit', component: EditAgenciesComponent },

// //           {
// //       path: 'details',
// //       loadComponent: () =>
// //         import('./pages/agencies/view-fleet-owner/view-fleet-owner.component').then(
// //           m => m.ViewAgencyComponent 
// //         )
// //     }
// //         ],
// //       },
// //  {
// //   path: 'fleet-owners',
// //   children: [
// //     { path: '', component: FleetOwnersComponent },
// //     { path: 'add', component: AddFleetOwnerComponent },
// //     { path: 'edit', component: EditFleetProfileComponentComponent },
// //     {
// //       path: 'details',
// //       loadComponent: () =>
// //         import('./pages/fleet-owners/view-fleet-owner/view-fleet-owner.component').then(
// //           m => m.ViewFleetOwnerComponent
// //         )
// //     }
// //   ],
// // }
// // ,
// //  {
// //   path: 'tablets',
// //   children: [
// //     { path: '', component: TabletComponent },
// //     { path: ':id', component: TabletViewComponent },
// //     {path:'assign',component: UserSelectDialogComponent}
// //   ],
// // },

      
// //              {
// //         path: 'passenger',
// //         children: [
// //           { path: '', component: PassengerComponent },
// //           { path: 'add', component: AddPassengerComponent },
// //           { path: 'edit', component: EditPassengerComponent },
// //           {
// //       path: 'details',
// //       loadComponent: () =>
// //         import('./pages/passanger/view-fleet-owner/view-fleet-owner.component').then(
// //           m => m.ViewPassengerComponent  
// //         )
// //     }
// //         ],
// //       },
  

// //       {
// //         path: 'drivers',
// //         children: [
// //           { path: '', component: DriverComponent },
// //           { path: 'add', component: AddDriverComponent },
// //           { path: 'edit', component: EditAdvertiserComponent },
// //              {
// //         path: 'details',
// //         loadComponent: () =>
// //           import('../app/pages/driver/view-fleet-owner/view-fleet-owner.component').then(
// //             (m) => m.DriverProfileComponent
// //           ),
// //       },
// //         ],
// //       },

// //       {
// //   path: 'approvals/:id',
// //   loadComponent: () =>
// //     import('../app/pages/approvals/view-application.component/view-application.component.component').then(
// //       m => m.ViewApplicationComponent
// //     )
// // },


// //     ],
// //   },
// //   { path: '**', redirectTo: '' },
// // ];




// import { Routes } from '@angular/router';

// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
// import { HomeComponent } from './homes/home/home.component';
// import { AddAdvertiserComponent } from './pages/advertiser/add-advertiser/add-advertiser.component';
// import { EditAdvertiserComponent } from './pages/advertiser/edit-advertiser/edit-advertiser.component';
// import { authGuard } from './auth/auth.guard';
// import { AddCampaignComponent } from '../app/pages/campaign/campaign/add-campaign/add-campaign.component';
// import { EditProfileComponentComponent } from '../app/pages/driver/edit-profile.component/edit-profile.component.component';
// import { AddDriverComponent } from '../app/pages/driver/add-driver/add-driver.component';
// import { DriverComponent } from './pages/driver/driver.component';
// import { AgenciesComponent } from './pages/agencies/agencies.component';
// import { FleetOwnersComponent } from './pages/fleet-owners/fleet-owners.component';
// import { PassengerComponent } from './pages/passanger/passanger.component';
// import { MessagesComponent } from './pages/messages/messages.component';
// import { AdminComponent } from './pages/admin/admin.component';
// import { ApprovalsComponent } from './pages/approvals/approvals.component';
// import { TabletComponent } from './pages/tablet/tablet.component';
// import { AddFleetOwnerComponent } from './pages/fleet-owners/add-fleet-owner/add-fleet-owner.component';
// import { AddAdminComponent } from './pages/admin/add-advertiser/add-advertiser.component';
// import { AddAgenciesComponent } from './pages/agencies/add-advertiser/add-advertiser.component';
// import { EditAgenciesComponent } from './pages/agencies/edit-profile.component/edit-profile.component.component';
// import { AddPassengerComponent } from './pages/passanger/add-advertiser/add-advertiser.component';
// import { EditPassengerComponent } from './pages/passanger/edit-profile.component/edit-profile.component.component';
// import { EditFleetProfileComponentComponent } from './pages/fleet-owners/edit-profile.component/edit-profile.component.component';
// import { TabletViewComponent } from './pages/tablet/tablet-view.component/tablet-view.component.component';
// import { UserSelectDialogComponent } from './pages/tablet/user-select-dialog/user-select-dialog.component';
// import { DashboardComponentAdvertiser } from './components/dashboard advertiser/dashboard.component';
// import { LoginComponent } from './components/auth/login/login.component';
// import { CamapignEditComponentPages } from './pages/camapign-edit/camapign-edit.component';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   {
//     path: '',
//     component: HomeComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: 'dashboard', component: DashboardComponentAdvertiser },

//       // Campaigns routes
//       { path: 'campaigns/new', component: AddCampaignComponent },
//       {
//         path: 'campaign/:id',
//         loadComponent: () =>
//           import('./pages/campaign-details/campaign-details.component').then(
//             (m) => m.CampaignDetailsComponent
//           ),
//       },
//              { path: 'campaign/edit/:id', component: CamapignEditComponentPages },
      
//       {
//         path: 'campaigns',
//         loadComponent: () =>
//           import('./pages/campaign/campaign.component').then(
//             (m) => m.CampaignComponent
//           ),
//       },

//       // Advertisers routes
//       {
//         path: 'advertisers',
//         children: [
//           { path: '', component: AdvertiserComponent },
//           { path: 'add', component: AddAdvertiserComponent },
//           { path: 'edit', component: EditAdvertiserComponent },
//           {
//             path: 'details',
//             loadComponent: () =>
//               import('./pages/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(
//                 m => m.ViewAdvertiserComponent
//               )
//           }
//         ],
//       },

//       // Admins routes
//       {
//         path: 'admins',
//         children: [
//           { path: '', component: AdminComponent },
//           { path: 'add', component: AddAdminComponent },
//           { path: 'edit', component: EditAdvertiserComponent },
//           {
//             path: 'details',
//             loadComponent: () =>
//               import('./pages/admin/view-fleet-owner/view-fleet-owner.component').then(
//                 m => m.ViewAdminComponent
//               )
//           }
//         ],
//       },

//       // Messages and Approvals
//       { path: 'messages', component: MessagesComponent },
//       { path: 'approvals', component: ApprovalsComponent },
      
//       // Agencies routes
//       {
//         path: 'agencies',
//         children: [
//           { path: '', component: AgenciesComponent },
//           { path: 'add', component: AddAgenciesComponent },
//           { path: 'edit', component: EditAgenciesComponent },
//           {
//             path: 'details',
//             loadComponent: () =>
//               import('./pages/agencies/view-fleet-owner/view-fleet-owner.component').then(
//                 m => m.ViewAgencyComponent 
//               )
//           }
//         ],
//       },

//       // Fleet Owners routes
//       {
//         path: 'fleet-owners',
//         children: [
//           { path: '', component: FleetOwnersComponent },
//           { path: 'add', component: AddFleetOwnerComponent },
//           { path: 'edit', component: EditFleetProfileComponentComponent },
//           {
//             path: 'details',
//             loadComponent: () =>
//               import('./pages/fleet-owners/view-fleet-owner/view-fleet-owner.component').then(
//                 m => m.ViewFleetOwnerComponent
//               )
//           }
//         ],
//       },

//       // Tablets routes
//       {
//         path: 'tablets',
//         children: [
//           { path: '', component: TabletComponent },
//           { path: ':id', component: TabletViewComponent },
//           { path: 'assign', component: UserSelectDialogComponent }
//         ],
//       },

//       // Passenger routes
//       {
//         path: 'passenger',
//         children: [
//           { path: '', component: PassengerComponent },
//           { path: 'add', component: AddPassengerComponent },
//           { path: 'edit', component: EditPassengerComponent },
//           {
//             path: 'details',
//             loadComponent: () =>
//               import('./pages/passanger/view-fleet-owner/view-fleet-owner.component').then(
//                 m => m.ViewPassengerComponent  
//               )
//           }
//         ],
//       },

//       // Drivers routes
//       {
//         path: 'drivers',
//         children: [
//           { path: '', component: DriverComponent },
//           { path: 'add', component: AddDriverComponent },
//           { path: 'edit/:email', component: EditProfileComponentComponent },
//           {
//             path: 'details',
//             loadComponent: () =>
//               import('../app/pages/driver/view-fleet-owner/view-fleet-owner.component').then(
//                 (m) => m.DriverProfileComponent
//               )
//           },
//         ],
//       },

//       // Approval details route
//       {
//         path: 'approvals/:id',
//         loadComponent: () =>
//           import('../app/pages/approvals/view-application.component/view-application.component.component').then(
//             m => m.ViewApplicationComponent
//           )
//       },
//     ],
//   },
  
//   // Wildcard route
//   { path: '**', redirectTo: 'login' },
// ];


