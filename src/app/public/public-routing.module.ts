import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { PublicDashboardComponent } from './components/public-dashboard/public-dashboard.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { ApplyJobComponent } from './components/apply-job/apply-job.component';
import { RecruitmentComponent } from './components/recruitment/recruitment.component';

import { AdminLoginComponent } from '../admin/components/admin-login/admin-login.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'dashboard', component: PublicDashboardComponent },
      { path: 'jobs', component: JobListComponent },
      { path: 'jobs/:id', component: JobDetailsComponent },
      { path: 'apply', component: ApplyJobComponent },
      { path: 'login', component: AdminLoginComponent },
      { path: 'recruitment', component: RecruitmentComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
