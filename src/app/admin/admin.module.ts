import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

// Angular Material Modules
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { JobpostingComponent } from './components/jobposting/jobposting.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminNavComponent,
    AdminLayoutComponent,
    RecruitmentComponent,
    AdminLoginComponent,
    CandidatesComponent,
    JobpostingComponent,
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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class AdminModule { }
