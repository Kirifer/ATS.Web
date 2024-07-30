//SIMPLIFIED VERSION OF THE WORKING CODE ABOVE
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map, tap } from 'rxjs';
// import { Job } from '../../../models/job';
import { JobRoles } from '../../../models/job-roles';

interface Job {
  title: string;
  description: string;
}

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
      tap(data => console.log('Data received from backend:', data)), // Log the received data
      catchError(error => { ``
        console.error('Error fetching jobs:', error);
        return throwError(() => new Error('Error fetching jobs'));
      })
    );
  }
}
