import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobCandidate, JobCandidateAttachment} from '../../../models/job-candidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';

import { ApplicationStatus, ApplicationStatusDisplay, SourcingTool, SourcingToolDisplay, HRInCharge, HRInChargeDisplay, NoticeDuration, NoticeDurationDisplay } from '../../../models/job-candidate';

@Component({
  selector: 'app-admin-job-candidate-creation',
  templateUrl: './admin-job-candidate-creation.component.html',
  styleUrls: ['./admin-job-candidate-creation.component.css'],
})
export class AdminJobCandidateCreationComponent implements OnInit {
  jobcandidates: JobCandidate[] = [];
  candidateForm: FormGroup;
  attachments: JobCandidateAttachment[] = [];

  applicationStatuses = Object.keys(ApplicationStatus).map(key => ({
    value: ApplicationStatus[key as keyof typeof ApplicationStatus],
    display: ApplicationStatusDisplay[key as keyof typeof ApplicationStatusDisplay]
  }));

  sourcingTools = Object.keys(SourcingTool).map(key => ({
    value: SourcingTool[key as keyof typeof SourcingTool],
    display: SourcingToolDisplay[key as keyof typeof SourcingToolDisplay]
  }));

  hrInCharges = Object.keys(HRInCharge).map(key => ({
    value: HRInCharge[key as keyof typeof HRInCharge],
    display: HRInChargeDisplay[key as keyof typeof HRInChargeDisplay]
  }));

  noticeDurations = Object.keys(NoticeDuration).map(key => ({
    value: NoticeDuration[key as keyof typeof NoticeDuration],
    display: NoticeDurationDisplay[key as keyof typeof NoticeDurationDisplay]
  }));

  constructor(public formBuilder: FormBuilder, private http: HttpClient) {
    this.candidateForm = this.formBuilder.group({
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
      noticeDuration: ['', Validators.required],
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

  ngOnInit() {}

  onSubmit(): void {
    if (this.candidateForm.valid) {
      let formData = this.candidateForm.value;
      formData.attachments = this.attachments;

      this.http.post('https://localhost:7012/jobcandidate', formData)
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

  onUpdate(id: string) {
    if (this.candidateForm.valid) {
      let formData = this.candidateForm.value;
      formData.attachments = this.attachments;

      this.http.put(`https://localhost:7012/candidates/${id}`, formData).pipe(
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const attachment: JobCandidateAttachment = {
          id: null,
          fileName: file.name,
          path: '',
          size: file.size,
          extension: file.type,
          savedFileName: '',
          createdOn: new Date(),
          content: e.target.result.split(',')[1] // Base64 encoded string
        };
        this.attachments.push(attachment);
      };
      reader.readAsDataURL(file);
    }
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
}
