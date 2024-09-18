import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JobCandidate, JobCandidateAttachment } from '../../../models/job-candidate';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
    const url = `${environment.jobcandidateUrl}/${candidateId}`;  // Use environment variable
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
  
// Check if the file is viewable based on its MIME type
isViewable(attachment: JobCandidateAttachment): boolean {
  const viewableExtensions = ['.pdf', '.jpeg', '.jpg', '.png', '.gif'];
  return viewableExtensions.includes(attachment.extension.toLowerCase());
}

// Method to handle viewing the attachment
viewAttachment(attachment: JobCandidateAttachment): void {
  const url = `${environment.jobcandidateUrl}/${this.jobCandidate?.id}/attachments/${attachment.id}`;
  console.log(`Viewing attachment from URL: ${url}`);
  
  this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
    const mimeType = blob.type;
    const objectUrl = URL.createObjectURL(blob);

    if (mimeType.startsWith('application/pdf') || mimeType.startsWith('image/')) {
      // Open viewable files (PDF, images) in a new tab
      const newTab = window.open();
      if (newTab) {
        newTab.location.href = objectUrl;
      } else {
        console.error('Failed to open new tab');
      }
    } else {
      console.error('File type is not viewable');
    }

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(objectUrl);
  }, (error: HttpErrorResponse) => {
    console.error('Error viewing attachment:', error.message);
  });
}

// Method to handle downloading the attachment
downloadAttachment(attachment: JobCandidateAttachment): void {
  const url = `${environment.jobcandidateUrl}/${this.jobCandidate?.id}/attachments/${attachment.id}`;
  console.log(`Downloading attachment from URL: ${url}`);
  
  this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = attachment.fileName;
    a.click();

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(objectUrl);
  }, (error: HttpErrorResponse) => {
    console.error('Error downloading attachment:', error.message);
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

      this.http.put(`${environment.jobcandidateUrl}/${this.jobCandidate.id}`, formData).pipe(
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