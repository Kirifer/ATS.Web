import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminJobRolePostingComponent } from './components/admin-job-role-posting/admin-job-role-posting.component';
import { AdminJobRoleExistingComponent } from './components/admin-job-role-existing/admin-job-role-existing.component';
import { AdminJobCandidateCreationComponent } from './components/admin-job-candidate-creation/admin-job-candidate-creation.component';
import { AdminJobCandidateExistingComponent } from './components/admin-job-candidate-existing/admin-job-candidate-existing.component';

// Angular Material Modules
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AdminJobRoleEditingComponent } from './components/admin-job-role-editing/admin-job-role-editing.component';
import { AdminJobCandidateEditingComponent } from './components/admin-job-candidate-editing/admin-job-candidate-editing.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminNavComponent,
    AdminLayoutComponent,
    AdminLoginComponent,
    AdminJobRolePostingComponent,
    AdminJobRoleExistingComponent,
    AdminJobCandidateCreationComponent,
    AdminJobCandidateExistingComponent,
    AdminJobRoleEditingComponent,
    AdminJobCandidateEditingComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class AdminModule { }
