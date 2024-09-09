//SIMPLIFIED VERSION OF THE WORKING CODE ABOVE
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map, tap } from 'rxjs';
// import { Job } from '../../../models/job';
import { JobLocation, JobLocationDisplay, JobRoles, RoleLevel, RoleLevelDisplay, ShiftSchedule, ShiftScheduleDisplay, JobStatus } from '../../../models/job-roles';

@Component({
  selector: 'app-public-dashboard',
  templateUrl: './public-dashboard.component.html',
  styleUrls: ['./public-dashboard.component.css']
})
export class PublicDashboardComponent implements OnInit {
  jobs$!: Observable<JobRoles[]>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.jobs$ = this.http.get<{ data: JobRoles[] }>('https://localhost:7012/jobrole').pipe(
      map(response => response.data),
      map(jobs => jobs.filter(job => job.jobStatus === JobStatus.SourcingCandidates || job.jobStatus === JobStatus.ForClientPresentation || job.jobStatus === JobStatus.ClientInterview)), // Filter jobs based on status
      tap(data => console.log('Filtered jobs:', data)), // Log the filtered jobs
      catchError(error => {
        console.error('Error fetching jobs:', error);
        return throwError(() => new Error('Error fetching jobs'));
      })
    );
  }

  getRoleLevelDisplay(role: RoleLevel): string {
    return RoleLevelDisplay[role];
  }

  getJobLocationDisplay(location: JobLocation): string {
    return JobLocationDisplay[location];
  }

  getShiftSchedDisplay(shift: ShiftSchedule): string {
    return ShiftScheduleDisplay[shift];
  }

  daysAgo(openDate: Date | undefined): number {
    if (!openDate) {
      return 0;
    }
    const postedDate = new Date(openDate);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - postedDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }
}