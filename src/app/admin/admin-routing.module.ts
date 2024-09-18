import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminJobCandidateCreationComponent } from './components/admin-job-candidate-creation/admin-job-candidate-creation.component';
import { AdminJobCandidateExistingComponent } from './components/admin-job-candidate-existing/admin-job-candidate-existing.component';
import { AdminJobRoleExistingComponent } from './components/admin-job-role-existing/admin-job-role-existing.component';
import { AdminJobRolePostingComponent } from './components/admin-job-role-posting/admin-job-role-posting.component';
import { UpdateCredentialsComponent } from './components/update-credentials/update-credentials.component';
import { AdminJobRoleEditingComponent } from './components/admin-job-role-editing/admin-job-role-editing.component';
import { AdminJobCandidateEditingComponent } from './components/admin-job-candidate-editing/admin-job-candidate-editing.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'admin-job-candidate-creation', component: AdminJobCandidateCreationComponent },
      { path: 'admin-job-candidate-existing', component: AdminJobCandidateExistingComponent },
      { path: 'admin-job-role-existing', component: AdminJobRoleExistingComponent },
      { path: 'admin-job-role-posting', component: AdminJobRolePostingComponent },
      { path: 'update-credentials', component: UpdateCredentialsComponent }, // Add login route here
      { path: 'admin/job-role-editing', component: AdminJobRoleEditingComponent },
      { path: 'admin/job-candidate-editing/:id', component: AdminJobCandidateEditingComponent }
    ]
  },
  { path: 'login', component: AdminLoginComponent }, // Add login route here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
