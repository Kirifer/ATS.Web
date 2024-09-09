import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JobCandidate, JobCandidateAttachment } from '../../../models/job-candidate';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ApplicationStatus, ApplicationStatusDisplay, SourcingTool, SourcingToolDisplay, HRInCharge, HRInChargeDisplay, NoticeDuration, NoticeDurationDisplay } from '../../../models/job-candidate';

@Component({
  selector: 'app-admin-job-candidate-editing',
  templateUrl: './admin-job-candidate-editing.component.html',
  styleUrls: ['./admin-job-candidate-editing.component.css']
})
export class AdminJobCandidateEditingComponent implements OnChanges {
  @Input() jobCandidate: JobCandidate | null = null;
  @Output() close = new EventEmitter<void>();

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      this.fetchAttachments(this.jobCandidate.id);
    }
  }


  fetchAttachments(candidateId: string): void {
    const url = `https://localhost:7012/jobcandidate/${candidateId}`;
    console.log(`Fetching job candidate from URL: ${url}`);
    this.http.get<{ data: JobCandidate, code: number, succeeded: boolean }>(url).pipe(
      tap(response => {
        console.log('Job candidate fetched:', response);
        if (response.succeeded) {
          this.attachments = response.data.attachments || [];
          console.log('Attachments extracted:', this.attachments);
        } else {
          console.error('Failed to fetch job candidate:', response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching job candidate:', error.message);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
        return throwError(() => new Error('Error fetching job candidate'));
      })
    ).subscribe();
  }
  
  viewAttachment(attachment: JobCandidateAttachment): void {
    const url = `https://localhost:7012/jobcandidate/${this.jobCandidate?.id}/attachments/${attachment.id}`;
    console.log(`Viewing attachment from URL: ${url}`);
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
        console.log('Downloaded blob size:', blob.size);  // Add this line to log the size
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.target = '_blank';
        a.download = attachment.fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
    }, (error: HttpErrorResponse) => {
        console.error('Error viewing attachment:', error.message);
    });
}


  onUpdate() {
    if (this.candidateForm.valid && this.jobCandidate) {

      // Get the form value
      const formData = { ...this.candidateForm.value };

      // Check if fields is an empty string and set it to null
      if (!formData.jobOffer) {
        formData.jobOffer = null;
      }
      if (!formData.candidateContract) {
        formData.candidateContract = null;
      }
      if (!formData.backgroundVerification) {
        formData.backgroundVerification = null;
      }
      if (!formData.technicalInterviewSchedule) {
        formData.technicalInterviewSchedule = null;
      }
      if (!formData.clientFinalInterviewSchedule) {
        formData.clientFinalInterviewSchedule = null;
      }

      this.http.put(`https://localhost:7012/jobcandidate/${this.jobCandidate.id}`, formData).pipe(
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

  // Listen for the ESC key press
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }
}