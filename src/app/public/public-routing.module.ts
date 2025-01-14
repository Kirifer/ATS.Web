import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { PublicDashboardComponent } from './components/public-dashboard/public-dashboard.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { PublicAboutComponent } from './components/public-about/public-about.component';
import { PublicApplicantStatusComponent } from './components/public-applicant-status/public-applicant-status.component';
import { authGuard } from '../auth/auth.guard';

import { AdminLoginComponent } from '../admin/components/admin-login/admin-login.component';
import { UpdateCredentialsComponent } from '../admin/components/update-credentials/update-credentials.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect root to dashboard
      { path: 'dashboard', component: PublicDashboardComponent },
      { path: 'jobs', component: JobListComponent },
      { path: 'login', component: AdminLoginComponent },
      { path: 'recruitment/:id', component: RecruitmentComponent},
      { path: 'about', component: PublicAboutComponent },
      { path: 'applicant-status', component: PublicApplicantStatusComponent, canActivate: [authGuard] },
      { path: 'update-credentials', component: UpdateCredentialsComponent, canActivate: [authGuard]}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
