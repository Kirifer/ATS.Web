// src/app/services/job.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from '../../environments/environment';
// import { Job } from '../models/job';

// @Injectable({
//   providedIn: 'root'
// })
// export class JobService {
//   private apiUrl = `${environment.apiUrl}/job_list`;

//   constructor(private http: HttpClient) {}

//   getJobs(): Observable<Job[]> {
//     return this.http.get<Job[]>(this.apiUrl).pipe(
//       catchError(error => {
//         console.error('Error fetching jobs', error);
//         return of([]); // Return an empty array in case of error
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor() { }
}
