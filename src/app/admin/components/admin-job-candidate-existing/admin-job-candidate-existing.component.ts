import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { JobCandidate } from '../../../models/job-candidate';
import { DomSanitizer } from '@angular/platform-browser';

import { ApplicationStatus, ApplicationStatusDisplay} from '../../../models/job-candidate';

@Component({
  selector: 'app-admin-job-candidate-existing',
  templateUrl: './admin-job-candidate-existing.component.html',
  styleUrl: './admin-job-candidate-existing.component.css'
})
export class AdminJobCandidateExistingComponent implements OnInit, AfterViewInit{

  ApplicationStatusDisplay = ApplicationStatusDisplay;

  displayedColumns: string[] = ['csequenceNo', 'candidateName', 'jobName', 'applicationStatus', 'interview_date', 'date_applied', 'actions'];
  dataSource = new MatTableDataSource<JobCandidate>();
  selectedJobCandidate: JobCandidate | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient){}

  jobcandidate$: Observable<JobCandidate[]>= of([]);
  ngOnInit() {
    this.http.get<{ data: JobCandidate[] }>('https://localhost:7012/jobcandidate')
      .pipe(
        map(response => response.data),
        tap(data => {
          console.log('Data received from backend:', data);
          this.dataSource.data = data;
        }),
        catchError(error => {
          console.error('Error fetching jobs:', error);
          return throwError(error);
        })
      ).subscribe();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editElement(element: JobCandidate) {
    this.selectedJobCandidate = element;
  }

  closeEditor() {
    this.selectedJobCandidate = null;
  }

  // Method to get display name for application status
  getApplicationStatusDisplay(status: ApplicationStatus): string {
    return ApplicationStatusDisplay[status];
  }

  getInterviewDate(candidate: any): string | null {
    if (candidate.applicationStatus === 'InitialInterview') {
        return candidate.initialInterviewSchedule ? candidate.initialInterviewSchedule.toString() : null;
    } else if (candidate.applicationStatus === 'TechnicalInterview') {
        return candidate.technicalInterviewSchedule ? candidate.technicalInterviewSchedule.toString() : null;
    } else if (candidate.applicationStatus === 'ClientInterview') {
        return candidate.clientFinalInterviewSchedule ? candidate.clientFinalInterviewSchedule.toString() : null;
    } else {
        return null;
    }
}

  deleteElement(element: JobCandidate) {
    if (confirm(`Are you sure you want to delete ${element.candidateName}?`)) {
      this.http.delete(`https://localhost:7012/jobcandidate/${element.id}`)
        .pipe(
          tap(() => {
            console.log('Element deleted:', element);
            // Remove the deleted element from the data source
            this.dataSource.data = this.dataSource.data.filter(e => e !== element);
          }),
          catchError(error => {
            console.error('Error deleting element:', error);
            return throwError(error);
          })
        ).subscribe();
    }
  }
}
