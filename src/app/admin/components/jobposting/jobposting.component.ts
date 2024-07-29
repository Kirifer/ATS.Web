import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError, map } from 'rxjs';
import { JobRoles } from '../../../models/job-roles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-jobposting',
  templateUrl: './jobposting.component.html',
  styleUrl: './jobposting.component.css',
})
export class JobpostingComponent implements OnInit{
  // jobroles$!: Observable<JobRoles[]>;
  jobroles: JobRoles[] = [];
  jobForm: FormGroup;

  constructor(public fb: FormBuilder, private http: HttpClient) {
    this.jobForm = this.fb.group({
      jobName: ['', Validators.required],
      clientShortcodes: ['', Validators.required],
      hiringManager: ['', Validators.required],
      salesManager: ['', Validators.required],
      hiringType: ['', Validators.required],
      jobDescription: ['', Validators.required],
      roleLevel: ['', Validators.required],
      minSalary: ['', Validators.required],
      maxSalary: ['', Validators.required],
      jobLocation: ['', Validators.required],
      shiftSched: ['', Validators.required],
      jobStatus: ['', Validators.required],
      closedDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // this.jobroles$ = this.http.get<{ data: JobRoles[] }>('https://localhost:7012/candidates').pipe(
    //   map(response => response.data),
    //   tap(data => console.log('Data received from backend:', data)),
    //   catchError(error => {
    //     console.error('Error fetching jobs:', error);
    //     return throwError(() => new Error('Error fetching jobs'));
    //   })
    // );
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.http.post('https://localhost:7012/candidates', this.jobForm.value)
        .subscribe({
          next: (response) => {
            console.log('Job submitted:', response);
            this.jobForm.reset();
          },
          error: (error) => {
            console.error('Error creating job:', error);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }

  // onUpdate(id: string) {
  //   if (this.jobForm.valid) {
  //     this.http.put(`https://localhost:7012/candidates/${id}`, this.jobForm.value).pipe(
  //       tap(response => console.log('Job updated:', response)),
  //       catchError(error => {
  //         console.error('Error updating job:', error);
  //         return throwError(() => new Error('Error updating job'));
  //       })
  //     ).subscribe();
  //   }
  // }

  // onDelete(id: string) {
  //   this.http.delete(`https://localhost:7012/candidates/${id}`).pipe(
  //     tap(response => console.log('Job deleted:', response)),
  //     catchError(error => {
  //       console.error('Error deleting job:', error);
  //       return throwError(() => new Error('Error deleting job'));
  //     })
  //   ).subscribe();
  // }
}