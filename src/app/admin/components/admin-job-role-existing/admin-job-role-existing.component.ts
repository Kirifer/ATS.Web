import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { JobRoles, HiringTypeDisplay, JobStatus, JobStatusDisplay, RoleLevelDisplay, HiringManagerDisplay, JobLocationDisplay, ShiftScheduleDisplay } from '../../../models/job-roles';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-job-role-existing',
  styleUrls: ['./admin-job-role-existing.component.css'],
  templateUrl: './admin-job-role-existing.component.html',
})
export class AdminJobRoleExistingComponent implements OnInit, AfterViewInit {
  startDate: Date | null = null;
  endDate: Date | null = null;

  displayedColumns: string[] = ['sequenceNo', 'jobName', 'aging', 'jobStatus', 'actions'];
  dataSource = new MatTableDataSource<JobRoles>();
  selectedJobRole: JobRoles | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  jobroles$: Observable<JobRoles[]> = of([]);
  ngOnInit() {
    this.http.get<{ data: JobRoles[] }>('https://localhost:7012/jobrole')
      .pipe(
        map(response => response.data),
        tap(data => {
          console.log('Data received from backend:', data);
          this.dataSource.data = this.filterByDate(data);
  
          // Log each JobRole and its Candidates to the console
          data.forEach(role => {
            console.log(`Job Role: ${role.sequenceNo}, Candidates:`, role.candidates);
          });
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

  getJobStatusClass(status: JobStatus): string {
    switch (status) {
      case JobStatus.SourcingCandidates:
        return 'badge badge-primary rounded-pill d-inline';
      case JobStatus.ForClientPresentation:
        return 'badge badge-info rounded-pill d-inline';
      case JobStatus.ClientInterview:
        return 'badge badge-warning rounded-pill d-inline';
      case JobStatus.FilledPosition:
        return 'badge badge-success rounded-pill d-inline';
      case JobStatus.Cancelled:
        return 'badge badge-danger rounded-pill d-inline';
      case JobStatus.OnHold:
        return 'badge badge-secondary rounded-pill d-inline';
      default:
        return 'badge badge-light rounded-pill d-inline';
    }
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

  filterByDate(data: JobRoles[]): JobRoles[] {
    if (!this.startDate || !this.endDate) {
      return data;
    }
    return data.filter(role => {
      const openDate = role.openDate ? new Date(role.openDate) : null;
      return this.startDate && this.endDate && openDate && openDate >= this.startDate && openDate <= this.endDate;
    });
  }

  downloadData(dataType: 'JobRoles') {
    const data = this.dataSource.data; // Get the data from dataSource
    const filteredData = this.filterByDate(data); // Apply filtering if necessary

    // Map your data to the desired column names
    const mappedData = filteredData.map((item: JobRoles) => ({
      'Job Role No.': item.sequenceNo,
      'Role': item.jobName,
      'Client Shortcodes': item.clientShortcodes,
      'Sales Manager': item.salesManager,
      'Hiring Manager': HiringManagerDisplay[item.hiringManager],
      'Type of Hiring': HiringTypeDisplay[item.hiringType],
      'Job Description': item.jobDescription,
      'Role Level': RoleLevelDisplay[item.roleLevel],
      'Minimum Salary': item.minSalary,
      'Maximum Salary': item.maxSalary,
      'Location': JobLocationDisplay[item.jobLocation],
      'Schedule': ShiftScheduleDisplay[item.shiftSched],
      'Status': JobStatusDisplay[item.jobStatus],
      'Date Requested': item.openDate,
      'Closed Date': item.closedDate,
      'Days Covered': item.daysCovered,
      'Aging': item.aging,
      // Include the csequenceNo from JobCandidate
      'Job Candidate No.': item.candidates?.map(candidate => candidate.csequenceNo).join(', ') || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataType);
    XLSX.writeFile(workbook, `${dataType}.xlsx`);
  }
}
