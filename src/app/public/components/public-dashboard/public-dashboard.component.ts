//SIMPLIFIED VERSION OF THE WORKING CODE ABOVE
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map, tap } from 'rxjs';
// import { Job } from '../../../models/job';
import { JobRoles } from '../../../models/job-roles';

interface Job {
  title: string;
  description: string;
  openDate: string;
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

  daysAgo(openDate: Date | undefined): number {
    if (!openDate) {
      return 0; // Handle cases where openDate might be undefined
    }
    const postedDate = new Date(openDate);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - postedDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
  }
  
}
