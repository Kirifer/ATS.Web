import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobCandidate, JobCandidateAttachment } from '../../../models/job-candidate';
import { JobRoles } from '../../../models/job-roles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';  // Import environment

import { ApplicationStatus, ApplicationStatusDisplay, SourcingTool, SourcingToolDisplay, HRInCharge, HRInChargeDisplay, NoticeDuration, NoticeDurationDisplay } from '../../../models/job-candidate';

@Component({
  selector: 'app-admin-job-candidate-creation',
  templateUrl: './admin-job-candidate-creation.component.html',
  styleUrls: ['./admin-job-candidate-creation.component.css'],
})
export class AdminJobCandidateCreationComponent implements OnInit {
  jobcandidates: JobCandidate[] = [];
  jobRoles: JobRoles[] = [];
  candidateForm: FormGroup;
  attachments: JobCandidateAttachment[] = [];
  isCandidateFormSubmitted: boolean = false;

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
      sourceTool: [''],
      assignedHr: [''],
      candidateCv: ['', Validators.required],
      candidateEmail: ['', Validators.required],
      candidateContact: ['', Validators.required],
      askingSalary: [''],
      salaryNegotiable: [''],
      minSalary: [''],
      maxSalary: [null],
      noticeDuration: ['', Validators.required],
      dateApplied: [''],
      initialInterviewSchedule: ['', Validators.required],
      technicalInterviewSchedule: [null],
      clientFinalInterviewSchedule: [null],
      backgroundVerification: [null],
      applicationStatus: [''],
      finalSalary: [null],
      allowance: [null],
      honorarium: [''],
      jobOffer: [null],
      candidateContract: [null],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.http.get<{ data: JobRoles[] }>(environment.jobroleUrl)
      .pipe(
        map(response => response.data),
        tap(data => {
          console.log('Data received from backend:', data);
  
          // Store the fetched job roles
          this.jobRoles = data;
        }),
        catchError(error => {
          console.error('Error fetching jobs:', error);
          return throwError(error);
        })
      ).subscribe();
  }
  
  onJobRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedJobRoleId = selectElement.value;
    const selectedJobRole = this.jobRoles.find(role => role.sequenceNo === selectedJobRoleId);
  
    if (selectedJobRole) {
      this.candidateForm.patchValue({
        jobName: selectedJobRole.jobName // Update jobName field
      });
    } else {
      this.candidateForm.patchValue({
        jobName: '' // Ensure jobName is reset if no role is selected
      });
    }
  }  


  onSubmit(): void {
    // Set the flag to true when submit is triggered    
    this.isCandidateFormSubmitted = true;

    if (this.candidateForm.valid) {
      let formData = this.candidateForm.value;
      formData.attachments = this.attachments;

      // Handle nullable dates
      formData.jobOffer = this.formatNullableDate(formData.jobOffer);
      formData.candidateContract = this.formatNullableDate(formData.candidateContract);
      formData.backgroundVerification = this.formatNullableDate(formData.backgroundVerification);
      formData.technicalInterviewSchedule = this.formatNullableDate(formData.technicalInterviewSchedule);
      formData.clientFinalInterviewSchedule = this.formatNullableDate(formData.clientFinalInterviewSchedule);

      // Convert empty strings to null for integer fields
      formData.maxSalary = this.convertEmptyToNull(formData.maxSalary);
      formData.finalSalary = this.convertEmptyToNull(formData.finalSalary);
      formData.allowance = this.convertEmptyToNull(formData.allowance);

      // Handle nullable enums
      formData.applicationStatus = this.formatEnum(formData.applicationStatus);
      formData.sourceTool = this.formatEnum(formData.sourceTool);
      formData.assignedHr = this.formatEnum(formData.assignedHr);
      formData.applicationStatus = this.formatEnum(formData.applicationStatus);

      Swal.fire({
        title: "Submit the Candidate Record?",
        text: "Are you sure you want to submit this candidate record? Please verify all details before proceeding.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit it",
        cancelButtonText: "Cancel",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post(environment.jobcandidateUrl, formData) // Use environment variable
            .subscribe({
              next: (response) => {
                console.log('Candidate submitted:', response);
                this.candidateForm.reset();
                this.setDefaultDropdownValues();
  
                Swal.fire({
                  title: "Submitted",
                  text: "The candidate record has been successfully submitted.",
                  icon: "success"
                });
              },
              error: (error) => {
                console.error('Error submitting candidate:', error);
                Swal.fire({
                  title: "Submission Failed",
                  text: "There was an error submitting the candidate record. Please try again.",
                  icon: "error"
                });
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Cancelled",
            text: "The candidate record was not submitted.",
            icon: "info"
          });
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

      this.http.put(`${environment.apiUrl}/${id}`, formData) // Use environment variable
        .pipe(
          tap(response => console.log('Job updated:', response)),
          catchError(error => {
            console.error('Error updating job:', error);
            return throwError(() => new Error('Error updating job'));
          })
        ).subscribe();
    }
  }

  onDelete(id: string) {
    this.http.delete(`${environment.apiUrl}/${id}`) // Use environment variable
      .pipe(
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
          ,
          mimeType: ''
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

  // Utility method to convert empty values to null - INTEGER
  convertEmptyToNull(value: any): number | null {
    return value === '' || value === undefined ? null : value;
  }

  // Utility method to convert empty values to null - DATE
  formatNullableDate(date: any): string | null {
    if (!date) return null;
    try {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  }

  // Utility method to handle enum formatting
  formatEnum(value: any): string | null {
    return value === '' ? null : value;
  }
}
