import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './homes/home/home.component';
import { authGuard } from './auth/auth.guard';
import { DashboardComponentDriver } from './components/dashboard driver/dashboard.component';
import { ApplicationDashboardComponent } from './components/application-dashboard/application-dashboard.component';
import { DashboardComponentFleet } from './components/dashboard-fleet-owner/dashboard.component';
import { DashboardComponentAgency } from './components/dashboard agency/dashboard.component';
import { DashboardComponentAdvertiser } from './components/dashboard advertiser/dashboard.component';
import { HomeComponentDriver } from './homes/home copy/home.component';
import { HomeComponentFleet } from './homes/home copy 2/home.component';
import { HomeComponentAgency } from './homes/home copy 3/home.component';
import { HomeComponentAdvertiser } from './homes/home copy 4/home.component';
import { ViewDriverProfile } from '../app/pages-dash/driver/view-fleet-owner/view-fleet-owner.component';
import { VehiclesComponent } from './pages-dash/vehicles.component/vehicles.component.component';
import { MessagesComponentDriver } from './pages-dash/messages/messages.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { MessagesComponentAdvertiser } from './pagess-advertiser/messages/messages.component';
import { DriverComponentFleet } from './pages-fleet-owner/driver/driver.component';
import { VehiclesComponentFleet } from './pages-fleet-owner/vehicles.component/vehicles.component.component';
import { TabletComponentFleet } from './pages-fleet-owner/tablet/tablet.component';
import { MessagesComponentFleet } from './pages-fleet-owner/messages/messages.component';
import { AddDriverComponent } from './pages-fleet-owner/driver/add-driver/add-driver.component';
import { AddCampaignComponent } from './pagess-advertiser/campaign/campaign/add-campaign/add-campaign.component';
import { CampaignComponentAdvertiser } from './pagess-advertiser/campaign/campaign.component';
import { CampaignDetailsComponent } from './pagess-advertiser/campaign-details/campaign-details.component';
import { EditProfileComponentDrive } from './pages-dash/driver/edit-profile.component/edit-profile.component.component';
import { EditFleetProfileComponentComponent } from './pages-fleet-owner/fleet-owners/edit-profile.component/edit-profile.component.component';
import { EditProfileComponentComponent } from './pages-fleet-owner/driver/edit-profile.component/edit-profile.component.component';
import { CampaignEditComponent } from './pagess-advertiser/camapign-edit/camapign-edit.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Admin Dashboard (unchanged)
  {
    path: 'admin',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard', component: DashboardComponent },
    ]
  },
  
  // Driver Dashboard (unchanged)
  {
    path: 'driver-dashboard',
    component: HomeComponentDriver,
    canActivate: [authGuard],
    data: { role: 'DRIVER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/pages-dash/driver/view-fleet-owner/view-fleet-owner.component').then(
            (m) => m.ViewDriverProfile
          ),
      },
       { path: 'vehicles', component: VehiclesComponent }, // Route for viewing single vehicle
              { path: 'messages', component: MessagesComponentDriver }, // Route for viewing single vehicle
            { path: 'edit/:email', component: EditProfileComponentDrive },

              
       

      {
        path: 'details',
        loadComponent: () =>
          import('../app/pages-dash/driver/view-fleet-owner/view-fleet-owner.component').then(
            (m) => m.ViewDriverProfile
          ),
      },
      
    ]
    
  },
  
  // Fleet Owner Dashboard (updated)
  {
    path: 'fleet-owner-dashboard',
    component: HomeComponentFleet,
    canActivate: [authGuard],
    data: { role: 'FLEET_OWNER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
     
       { path: 'drivers', component: DriverComponentFleet }, // Route for viewing single vehicle
        { path: 'vehicles', component: VehiclesComponentFleet }, // Route for viewing single vehicle
         { path: 'tablets', component: TabletComponentFleet }, // Route for viewing single vehicle
           { path: 'messages', component: MessagesComponentFleet}, // Route for viewing single vehicle
       
              { path: 'edit/:email', component: EditProfileComponentComponent },

 {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/pages-fleet-owner/fleet-owners/view-fleet-owner/view-fleet-owner.component').then(
            (m) => m.ViewFleetOwnerComponent
          ),
      },
      { path: 'add', component: AddDriverComponent }, // Route for viewing single vehicle

        {
        path: 'driver-details',
        loadComponent: () =>
          import('../app/pages-fleet-owner/driver/view-fleet-owner/view-fleet-owner.component').then(
            (m) => m.FleetDriverProfileComponent
          ),
      },

      {
        path: 'details',
        loadComponent: () =>
          import('../app/pages-fleet-owner/fleet-owners/view-fleet-owner/view-fleet-owner.component').then(
            (m) => m.ViewFleetOwnerComponent
          ),
      },
    ]
  },
  
  // Agency Dashboard (updated)
  {
    path: 'agency-dashboard',
    component: HomeComponentAgency,
    canActivate: [authGuard],
    data: { role: 'AGENCY' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponentAgency },
    ]
  },
  
  // Advertiser Dashboard (updated)
  {
    path: 'advertiser-dashboard',
    component: HomeComponentAdvertiser,
    canActivate: [authGuard],
    data: { role: 'ADVERTISER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
 {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/pagess-advertiser/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(
            (m) => m.ViewAdvertiserComponentDetatils
          ),
      },
       { path: 'campaigns', component: CampaignComponentAdvertiser }, // Route for viewing single vehicle
        { path: 'messages', component: MessagesComponentAdvertiser }, // Route for viewing single vehicle
          { path: 'add', component: AddCampaignComponent }, 
          { path: 'edit/:id', component: CampaignEditComponent },

    {
        path: 'view-campaign/:id',

        loadComponent: () =>
          import('./pagess-advertiser/campaign-details/campaign-details.component').then(
            (m) => m.CampaignDetailsComponent
          )
      },
      {
        path: 'details',
        loadComponent: () =>
          import('../app/pagess-advertiser/advertiser/view-advertiser-owner/view-advertiser-owner.component').then(
            (m) => m.ViewAdvertiserComponentDetatils
          ),
      },
    ]
  },
  
  // Applicant Dashboard (unchanged)
  { 
    path: 'application-dashboard', 
    component: ApplicationDashboardComponent,
    canActivate: [authGuard],
  },
  
  { path: '**', redirectTo: 'login' }
];