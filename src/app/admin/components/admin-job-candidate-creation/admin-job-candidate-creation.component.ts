import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, tap, throwError, map } from 'rxjs';

@Component({
  selector: 'app-admin-job-candidate-creation',
  templateUrl: './admin-job-candidate-creation.component.html',
  styleUrl: './admin-job-candidate-creation.component.css',
})
export class AdminJobCandidateCreationComponent implements OnInit{

  jobcandidates: JobCandidate[] = [];
  candidateForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private http: HttpClient){
    this.candidateForm = this.formBuilder.group({
      csequenceNo: [{ value: '', disabled: true }, Validators.required],
      candidateName: ['', Validators.required],
      jobRoleId: ['', Validators.required],
      jobName: ['', Validators.required],
      sourceTool: ['', Validators.required],
      assignedHr: ['', Validators.required],
      candidateCv: ['', Validators.required],
      candidateEmail: ['', Validators.required],
      candidateContact: ['', Validators.required],
      askingSalary: [''],
      salaryNegotiable: [''],
      minSalary: [''],
      maxSalary: [''],
      noticeDuration: [''],
      dateApplied: ['', Validators.required],
      initialInterviewSchedule: ['', Validators.required],
      technicalInterviewSchedule: ['', Validators.required],
      clientFinalInterviewSchedule: ['', Validators.required],
      backgroundVerification: ['', Validators.required],
      applicationStatus: ['', Validators.required],
      finalSalary: [''],
      allowance: [''],
      honorarium: [''],
      jobOffer: [''],
      candidateContract: [''],
      remarks: ['']
    });
  }

  ngOnInit() {
    
  }

  logValidationErrors(group: FormGroup = this.candidateForm): void {
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
    if (this.candidateForm.valid) {
      this.http.post('https://localhost:7012/jobcandidate', this.candidateForm.value)
        .subscribe({
          next: (response) => {
            console.log('Job candidate submitted:', response);
            this.candidateForm.reset();
            this.setDefaultDropdownValues();
          },
          error: (error) => {
            console.error('Error creating candidate:', error);
          }
        });
    } else {
      console.log('Form is invalid');
      this.logValidationErrors();
    }
  }

  setDefaultDropdownValues(): void {
    this.candidateForm.patchValue({
      applicationStatus: '',
      jobRoleId: '',
      assignedHr: '',
      sourceTool: '',
      salaryNegotiable: '',
      noticeDuration: ''
    });
  }

  onUpdate(id: string) {
    if (this.candidateForm.valid) {
      this.http.put(`https://localhost:7012/candidates/${id}`, this.candidateForm.value).pipe(
        tap(response => console.log('Job updated:', response)),
        catchError(error => {
          console.error('Error updating job:', error);
          return throwError(() => new Error('Error updating job'));
        })
      ).subscribe();
    }
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7012/candidates/${id}`).pipe(
      tap(response => console.log('Job deleted:', response)),
      catchError(error => {
        console.error('Error deleting job:', error);
        return throwError(() => new Error('Error deleting job'));
      })
    ).subscribe();
  }
}

