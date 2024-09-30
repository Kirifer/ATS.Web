import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';
import { User } from '../../../models/user';
import { environment } from '../../../../environments/environment';

// Import the enum and display mappings
import { 
  ApplicationStatus, ApplicationStatusDisplay, 
  SourcingTool, SourcingToolDisplay, 
  HRInCharge, HRInChargeDisplay, 
  NoticeDuration, NoticeDurationDisplay 
} from '../../../models/job-candidate';

@Component({
  selector: 'app-public-applicant-status',
  templateUrl: './public-applicant-status.component.html',
  styleUrls: ['./public-applicant-status.component.css']
})
export class PublicApplicantStatusComponent implements OnInit {
  jobCandidates: JobCandidate[] = [];
  currentUser: User | null = null;

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.getJobCandidateStatus(this.currentUser.email);
    }
  }

  getJobCandidateStatus(email: string): void {
    const url = `${environment.updateUserUrl}/email/${email}`;
    this.http.get<any>(url).subscribe(
      response => {
        if (response && response.data) {
          this.jobCandidates = response.data.jobCandidates || [];
          console.log('Job Candidates fetched:', this.jobCandidates);
        }
      },
      error => {
        console.error('Error fetching job candidate status:', error);
      }
    );
  }

  // Method to get display text for Application Status
  getApplicationStatusDisplay(status: ApplicationStatus): string {
    return ApplicationStatusDisplay[status] || 'Unknown Status';
  }

  // Method to get display text for Notice Duration
  getNoticeDurationDisplay(duration: NoticeDuration): string {
    return NoticeDurationDisplay[duration] || 'Unknown Duration';
  }
}
