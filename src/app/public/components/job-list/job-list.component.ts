// import { Component } from '@angular/core';

// interface Job {
//   job_title: string;
//   job_location: string;
//   job_setting: string;
//   job_description: string;
//   job_posted: string;
// }

// @Component({
//   selector: 'app-job-list',
//   templateUrl: './job-list.component.html',
//   styleUrl: './job-list.component.css'
// })
// export class JobListComponent {
//   jobs: Job[] = [
//     {
//       job_title: 'Web Developer',
//       job_location: 'New York, NY',
//       job_setting: 'Permanent / Full-time',
//       job_description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//       job_posted: 'Posted 2 days ago'
//     }
//   ];
// }


// import { Component, OnInit } from '@angular/core';
// import { JobService } from '../../../services/job.service';
// import { Job } from '../../../models/job';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-job-list',
//   templateUrl: './job-list.component.html',
//   styleUrls: ['./job-list.component.css']
// })
// export class JobListComponent {

// }

// import { Component, inject, OnInit } from '@angular/core';
// import { JobService } from '../../../services/job.service';
// import { Job } from '../../../models/job';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-job-list',
//   templateUrl: './job-list.component.html',
//   styleUrls: ['./job-list.component.css']
// })
// export class JobListComponent implements OnInit {
//   http = inject(HttpClient)
//   jobs: Job[] = [];

//   constructor(private jobService: JobService) { }

//   ngOnInit(): void {
//     this.getJobs();
//   }

//   getJobs(): void {
//     this.jobService.getJobs().subscribe(jobs => this.jobs = jobs);
//   }
// }



// import { Component, inject, OnInit } from '@angular/core';
// import { Job } from '../../../models/job';
// import { HttpClient } from '@angular/common/http';
// import { catchError, Observable, tap, throwError } from 'rxjs';

// @Component({
//   selector: 'app-job-list',
//   templateUrl: './job-list.component.html',
//   styleUrls: ['./job-list.component.css']
// })
// export class JobListComponent{
//   http = inject(HttpClient)

//   jobs$ = this.getJobs();

//   ngOnInit() {
//     this.jobs$.subscribe(jobs => console.log('Jobs in component:', jobs));
//   }

//   private getJobs(): Observable<Job[]> {
//     return this.http.get<Job[]>('https://localhost:7012/job_list').pipe(
//       tap(data => console.log('Data received from backend:', data)), // Log the received data
//       catchError(error => {
//         console.error('Error fetching jobs:', error);
//         return throwError(() => new Error('Error fetching jobs'));
//       })
//     );
//   }
// }


// WORKING!!!
// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, Observable, of, tap, throwError, map } from 'rxjs';
// import { Job } from '../../../models/job';

// @Component({
//   selector: 'app-job-list',
//   templateUrl: './job-list.component.html',
//   styleUrls: ['./job-list.component.css']
// })
// export class JobListComponent implements OnInit {
//   jobs$: Observable<Job[]> = of([]); // Initialize with an empty observable

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.jobs$ = this.getJobs();
//     this.jobs$.subscribe({
//       next: jobs => console.log('Jobs in component:', jobs),
//       error: err => console.error('Error in subscription:', err)
//     });
//   }

//   private getJobs(): Observable<Job[]> {
//     return this.http.get<{ data: Job[] }>('https://localhost:7012/job_list').pipe(
//       map(response => response.data), // Extract the data property
//       tap(data => console.log('Data received from backend:', data)), // Log the received data
//       catchError(error => {
//         console.error('Error fetching jobs:', error);
//         return throwError(() => new Error('Error fetching jobs'));
//       })
//     );
//   }
// }

//SIMPLIFIED VERSION OF THE WORKING CODE ABOVE
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map, tap } from 'rxjs';
// import { Job } from '../../../models/job';
import { JobRoles } from '../../../models/job-roles';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
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

