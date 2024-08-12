import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
      // this.fetchAttachments(this.jobCandidate.id);
    }
  }

  onUpdate() {
    if (this.candidateForm.valid && this.jobCandidate) {
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

  onClose() {
    this.close.emit();
  }

  // fetchAttachments(candidateId: string): void {
  //   this.http.get<JobCandidateAttachment[]>(`https://localhost:7012/jobcandidate/${candidateId}/attachments`).subscribe({
  //     next: (attachments) => {
  //       this.attachments = attachments;
  //       console.log('Attachments fetched:', attachments);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching attachments:', error);
  //     }
  //   });
  // }

  // viewAttachment(attachment: JobCandidateAttachment): void {
  //   if (attachment && attachment.id && this.jobCandidate) {
  //     const candidateId = this.jobCandidate.id;
  //     const attachmentId = attachment.id;
  //     const url = `https://localhost:7012/jobcandidate/${candidateId}/attachments/${attachmentId}`;
  
  //     console.log(`Fetching attachment from URL: ${url}`);
  
  //     this.http.get(url, { responseType: 'blob' }).subscribe((file: Blob) => {
  //       const fileURL = window.URL.createObjectURL(file);
  //       const fileType = file.type;
  
  //       if (fileType.startsWith('image/') || fileType === 'application/pdf') {
  //         window.open(fileURL);
  //       } else {
  //         const link = document.createElement('a');
  //         link.href = fileURL;
  //         link.download = attachment.fileName;
  //         link.click();
  //       }
  //     }, error => {
  //       console.error('Error fetching the attachment:', error);
  //     });
  //   } else {
  //     console.error('No attachment found for the candidate.');
  //   }
  // }
}