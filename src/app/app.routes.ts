


import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampaignEditComponent } from './pagess-advertiser/camapign-edit/camapign-edit.component';
import { AdvertiserComponent } from './pages/advertiser/advertiser.component';
import { HomeComponent } from './homes/home/home.component';
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

import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponentAdvertiser } from './components/dashboard advertiser/dashboard.component';
import { PageStubComponent } from './pages/page-stub/page-stub.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login route (now the landing page)
{ path: '', component: LoginComponent },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'financial',
        loadComponent: () => import('./pages/financial/financial.component').then(m => m.FinancialComponent)
      },
      // Ad-Ops extras
      // Ad-Ops concrete routes
      { path: 'campaigns/active', loadComponent: () => import('./pages/campaign/campaign.component').then(m => m.CampaignComponent) },
      { path: 'campaigns/reports', loadComponent: () => import('./pages/campaign-analytics/campaign-analytics.component').then(m => m.CampaignAnalyticsComponent) },
      { path: 'exports', component: PageStubComponent, data: { title: 'Exports', description: 'CSV/PDF exports' } },
      { path: 'tablets/assignments', loadComponent: () => import('./pages/tablet/tablet.component').then(m => m.TabletComponent) },
      { path: 'tablets/inventory', loadComponent: () => import('./pages/tablet/tablet.component').then(m => m.TabletComponent) },
      { path: 'tablets/:id', loadComponent: () => import('./pages/tablet/tablet-view.component/tablet-view.component.component').then(m => m.TabletViewComponent) },
      { path: 'creatives/library', component: PageStubComponent, data: { title: 'Creative Library', description: 'Assets and media' } },
      { path: 'creatives/qa', component: PageStubComponent, data: { title: 'QA Tools', description: 'Preview and validation' } },
      // CRM
      { path: 'contacts', component: PageStubComponent, data: { title: 'Contacts', description: 'People (POCs)'} },
      { path: 'opportunities', component: PageStubComponent, data: { title: 'Opportunities', description: 'Pipeline and deals' } },
      { path: 'forecast', component: PageStubComponent, data: { title: 'Forecast', description: 'Revenue forecast' } },
      { path: 'activity', component: PageStubComponent, data: { title: 'Activity & Notes', description: 'Timeline, notes, tasks' } },
      { path: 'segments', component: PageStubComponent, data: { title: 'Segments & Audiences', description: 'Saved audiences' } },
      { path: 'documents', component: PageStubComponent, data: { title: 'Documents', description: 'Contracts, SOWs, IOs' } },
      { path: 'support', component: PageStubComponent, data: { title: 'Support', description: 'Tickets and SLAs' } },
      // Business & Financials
      { path: 'billing/invoices', component: PageStubComponent, data: { title: 'Invoices', description: 'Issued, due, overdue' } },
      { path: 'billing/credit-notes', component: PageStubComponent, data: { title: 'Credit Notes', description: 'Adjustments and credits' } },
      { path: 'payouts', component: PageStubComponent, data: { title: 'Payouts & Compensation', description: 'Driver/Fleet payouts' } },
      { path: 'pricing', component: PageStubComponent, data: { title: 'Pricing & Estimator', description: 'CPM/CPV calculator' } },
      { path: 'contracts', component: PageStubComponent, data: { title: 'Contracts & Purchase Orders', description: 'IOs, POs, renewals' } },
      { path: 'budgeting', component: PageStubComponent, data: { title: 'Budgeting & Forecasts', description: 'Revenue plans by period' } },
      { path: 'reconciliation', component: PageStubComponent, data: { title: 'Reconciliation', description: 'Delivery vs invoice vs payout checks' } },
      { path: 'analytics/revenue', component: PageStubComponent, data: { title: 'Business Analytics', description: 'Revenue and margin trends' } },
      // Settings
      { path: 'settings', component: PageStubComponent, data: { title: 'Settings', description: 'Users & Roles, Permissions, Integrations, Feature Flags' } },
      { path: 'settings/users', component: PageStubComponent, data: { title: 'Users & Roles', description: 'Manage users and roles' } },
      { path: 'settings/permissions', component: PageStubComponent, data: { title: 'Permissions', description: 'Access control' } },
      { path: 'settings/integrations', component: PageStubComponent, data: { title: 'Integrations', description: 'Billing, CRM, storage' } },
      { path: 'settings/flags', component: PageStubComponent, data: { title: 'Feature Flags', description: 'Toggle features' } },
      { path: 'dashboard', component: DashboardComponentAdvertiser },
      { path: 'campaigns/new', component: AddCampaignComponent },
 
      {
        path: 'campaign/:id',
        loadComponent: () =>
          import('./pages/campaign-details/campaign-details.component').then(
            (m) => m.CampaignDetailsComponent
          ),
      },
      {
        path: 'campaign/:id/analytics',
        loadComponent: () =>
          import('./pages/campaign-analytics/campaign-analytics.component').then(
            (m) => m.CampaignAnalyticsComponent
          ),
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./pages/campaign/campaign.component').then(
            (m) => m.CampaignComponent
          ),
      },
      {
        path: 'campaigns/edit/:id',
        component: CampaignEditComponent,
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