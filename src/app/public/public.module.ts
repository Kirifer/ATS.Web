import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClient } from '@angular/common/http';

// Angular Material Modules
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


import { PublicRoutingModule } from './public-routing.module';
import { PublicDashboardComponent } from './components/public-dashboard/public-dashboard.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { PublicNavComponent } from './components/public-nav/public-nav.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PublicAboutComponent } from './components/public-about/public-about.component';
import { PublicApplicantStatusComponent } from './components/public-applicant-status/public-applicant-status.component';

@NgModule({
  declarations: [
    PublicDashboardComponent,
    JobListComponent,
    PublicNavComponent,
    PublicLayoutComponent,
    PublicFooterComponent,
    RecruitmentComponent,
    PublicAboutComponent,
    PublicApplicantStatusComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    RouterOutlet,
    HttpClientModule,
    MatProgressBar,
    MatGridListModule,

  ],
  providers: [provideNativeDateAdapter()]
})
export class PublicModule { }
