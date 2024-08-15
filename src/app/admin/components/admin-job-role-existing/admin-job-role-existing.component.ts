import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { HiringType, HiringTypeDisplay, JobRoles, JobStatus, JobStatusDisplay, RoleLevel, RoleLevelDisplay } from '../../../models/job-roles';

@Component({
  selector: 'app-admin-job-role-existing',
  styleUrls: ['./admin-job-role-existing.component.css'],
  templateUrl: './admin-job-role-existing.component.html',
})
export class AdminJobRoleExistingComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sequenceNo', 'jobName', 'aging', 'jobStatus', 'actions'];
  dataSource = new MatTableDataSource<JobRoles>();
  selectedJobRole: JobRoles | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

  jobroles$: Observable<JobRoles[]> = of([]);
  ngOnInit() {
    this.http.get<{ data: JobRoles[] }>('https://localhost:7012/jobrole')
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

  editElement(element: JobRoles) {
    this.selectedJobRole = element;
  }

  closeEditor() {
    this.selectedJobRole = null;
  }

  // Method to get display name for application status
  getJobStatusDisplay(status: JobStatus): string {
    return JobStatusDisplay[status];
  }



  deleteElement(element: JobRoles) {
    if (confirm(`Are you sure you want to delete ${element.jobName}?`)) {
      this.http.delete(`https://localhost:7012/jobrole/${element.id}`)
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
