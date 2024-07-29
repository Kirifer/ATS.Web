import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { JobpostingComponent } from './components/jobposting/jobposting.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'recruitment', component: RecruitmentComponent },
      { path: 'candidates', component: CandidatesComponent},
      { path: 'jobposting', component: JobpostingComponent}
    ]
  },
  { path: 'login', component: AdminLoginComponent } // Add login route here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
