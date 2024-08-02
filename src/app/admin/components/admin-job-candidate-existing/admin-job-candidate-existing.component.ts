import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { JobCandidate } from '../../../models/job-candidate';

@Component({
  selector: 'app-admin-job-candidate-existing',
  templateUrl: './admin-job-candidate-existing.component.html',
  styleUrl: './admin-job-candidate-existing.component.css'
})
export class AdminJobCandidateExistingComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = ['csequenceNo', 'candidateName', 'jobName', 'applicationStatus', 'actions'];
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

  deleteElement(element: JobCandidate) {
    // Add your delete logic here
    console.log('Delete element:', element);
  }
}

// import { Component } from "@angular/core";

// @Component({
//   selector: 'app-admin-job-candidate-existing',
//   templateUrl: './admin-job-candidate-existing.component.html',
//   styleUrls: ['./admin-job-candidate-existing.component.css']
// })

// export class AdminJobCandidateExistingComponent{
  
// }