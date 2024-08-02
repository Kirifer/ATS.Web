import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-admin-job-candidate-editing',
  templateUrl: './admin-job-candidate-editing.component.html',
  styleUrl: './admin-job-candidate-editing.component.css'
})
export class AdminJobCandidateEditingComponent implements OnChanges{
  @Input() jobCandidate: JobCandidate | null = null;
  @Output() close = new EventEmitter<void>();

  candidateForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient){
    this.candidateForm = this.fb.group({
      candidateName: [''],
      jobRoleId: [''],
      jobName: [''],
      sourceTool: [''],
      assignedHr: [''],
      candidateCv: [''],
      candidateEmail: [''],
      candidateContact: [''],
      askingSalary: [0],
      salaryNegotiable: [''],
      minSalary: [0],
      maxSalary: [0],
      noticeDuration: [''],
      dateApplied: [''],
      initialInterviewSchedule: [''],
      technicalInterviewSchedule: [''],
      clientFinalInterviewSchedule: [''],
      backgroundVerification: [''],
      applicationStatus: [''],
      finalSalary: [0],
      allowance: [0],
      honorarium: [''],
      jobOffer: [''],
      candidateContract: [''],
      remarks: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobCandidate'] && this.jobCandidate) {
      this.candidateForm.patchValue(this.jobCandidate);
    }
  }

  onUpdate(){
    if(this.candidateForm.valid && this.jobCandidate){
      this.http.put(`https://localhost:7012/jobcandidate/${this.jobCandidate.id}`, this.candidateForm.value).pipe(
        tap(response => {
          console.log('Job candidate updated:', response);
          this.onClose();
        }),
        catchError(error => {
          console.error('Error updating job candidate:', error);
          return throwError(() => new Error('Error updating job candidate'));
        })
      ).subscribe();
    }
  }

  onClose(){
    this.close.emit();
  }
}
