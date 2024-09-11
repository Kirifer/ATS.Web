import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError, map } from 'rxjs';
import { HiringManager, HiringManagerDisplay, HiringType, HiringTypeDisplay, JobLocation, JobLocationDisplay, JobRoles, JobStatus, JobStatusDisplay, RoleLevel, RoleLevelDisplay, ShiftSchedule, ShiftScheduleDisplay } from '../../../models/job-roles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-job-role-posting',
  templateUrl: './admin-job-role-posting.component.html',
  styleUrl: './admin-job-role-posting.component.css'
})
export class AdminJobRolePostingComponent implements OnInit {
  jobroles: JobRoles[] = [];
  jobForm: FormGroup;
  isJobFormSubmitted: boolean = false;

  hiringType = Object.keys(HiringType).map(key => ({
    value: HiringType[key as keyof typeof HiringType],
    display: HiringTypeDisplay[key as keyof typeof HiringTypeDisplay]
  }));

  roleLevel = Object.keys(RoleLevel).map(key => ({
    value: RoleLevel[key as keyof typeof RoleLevel],
    display: RoleLevelDisplay[key as keyof typeof RoleLevelDisplay]
  }));

  jobLocation = Object.keys(JobLocation).map(key => ({
    value: JobLocation[key as keyof typeof JobLocation],
    display: JobLocationDisplay[key as keyof typeof JobLocationDisplay]
  }));

  shiftSched = Object.keys(ShiftSchedule).map(key => ({
    value: ShiftSchedule[key as keyof typeof ShiftSchedule],
    display: ShiftScheduleDisplay[key as keyof typeof ShiftScheduleDisplay]
  }));

  hiringManager = Object.keys(HiringManager).map(key => ({
    value: HiringManager[key as keyof typeof HiringManager],
    display: HiringManagerDisplay[key as keyof typeof HiringManagerDisplay]
  }));

  jobStatus = Object.keys(JobStatus).map(key => ({
    value: JobStatus[key as keyof typeof JobStatus],
    display: JobStatusDisplay[key as keyof typeof JobStatusDisplay]
  }));

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
      openDate: [{ value: '', disabled: true }],
      closedDate: [{ value: '', disabled: true }, Validators.required],
      aging: [{ value: '', disabled: true }, Validators.required] // Disable input in the form
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

  logValidationErrors(group: FormGroup = this.jobForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.logValidationErrors(control);
      } else {
        if (control && control.invalid) {
          console.log(`Field ${key} is invalid. Errors:`, control.errors);
        }
      }
    });
  }

  onSubmit(): void {
    // Set the flag to true when submit is triggered    
    this.isJobFormSubmitted = true;

    if (this.jobForm.valid) {
      Swal.fire({
        title: "Submit a new Job Role?",
        text: "Are you sure of the details you provided? Double check if you missed some information.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I am sure!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post(environment.jobroleUrl, this.jobForm.value)
            .subscribe({
              next: (response) => {
                console.log('Job submitted:', response);
                this.jobForm.reset();
                this.setDefaultDropdownValues();
  
                Swal.fire({
                  title: "Submitted",
                  text: "Your job role was successfully submitted!",
                  icon: "success"
                });
              },
              error: (error) => {
                console.error('Error creating job:', error);
                Swal.fire({
                  title: "Submission Failed",
                  text: "There was an error submitting this job role. Please try again.",
                  icon: "error"
                });
              }
            });
        } else {
          console.log('Submission canceled');
        }
      });
    } else {
      console.log('Form is invalid');
      this.logValidationErrors();
    }
  }  

  setDefaultDropdownValues(): void {
    this.jobForm.patchValue({
      jobStatus: '',
      hiringManager: '',
      salesManager: '',
      hiringType: '',
      roleLevel: '',
      jobLocation: '',
      shiftSched: ''
    });
  }

  onUpdate(id: string) {
    if (this.jobForm.valid) {
      this.http.put(`${environment.apiUrl}/${id}`, this.jobForm.value).pipe(
        tap(response => console.log('Job updated:', response)),
        catchError(error => {
          console.error('Error updating job:', error);
          return throwError(() => new Error('Error updating job'));
        })
      ).subscribe();
    }
  }

  onDelete(id: string) {
    this.http.delete(`${environment.apiUrl}/${id}`).pipe(
      tap(response => console.log('Job deleted:', response)),
      catchError(error => {
        console.error('Error deleting job:', error);
        return throwError(() => new Error('Error deleting job'));
      })
    ).subscribe();
  }
}
