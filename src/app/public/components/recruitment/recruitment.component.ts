import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { JobCandidate, JobCandidateAttachment } from '../../../models/job-candidate';
import { JobLocation, JobLocationDisplay, JobRoles, RoleLevel, RoleLevelDisplay, ShiftSchedule, ShiftScheduleDisplay } from '../../../models/job-roles';
import { Observable, catchError, throwError, map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

import { NoticeDuration, NoticeDurationDisplay } from '../../../models/job-candidate';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css']
})
export class RecruitmentComponent implements OnInit {
  jobcandidates: JobCandidate[] = [];
  recruitmentForm: FormGroup;
  jobs$!: Observable<JobRoles>;
  job?: JobRoles;
  isRecruitmentFormSubmitted: boolean = false;

  attachments: JobCandidateAttachment[] = [];

  noticeDurations = Object.keys(NoticeDuration).map(key => ({
    value: NoticeDuration[key as keyof typeof NoticeDuration],
    display: NoticeDurationDisplay[key as keyof typeof NoticeDurationDisplay]
  }));

  constructor(public fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.recruitmentForm = this.fb.group({
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.http.get<{ data: JobRoles }>(`${environment.jobroleUrl}/${id}`).pipe(
          tap(response => {
            console.log('Data received from backend:', response);
            this.job = response.data; // Assign data to job property
  
            // Update form with the received job data
            this.recruitmentForm.patchValue({
              jobRoleId: this.job?.sequenceNo || '', // Set sequenceNo from console to candidate.jobRoleId
              jobName: this.job?.jobName || '', // Set jobName from console to candidate.jobName
              dateApplied: new Date().toISOString().split('T')[0] // Set current date
            });
          }),
          catchError(error => {
            console.error('Error fetching job role:', error);
            return throwError(() => new Error('Error fetching job role'));
          })
        ).subscribe();
      } else {
        // If no job role ID is provided, set current date here as a fallback
        this.recruitmentForm.patchValue({
          dateApplied: new Date().toISOString().split('T')[0] // Set current date
        });
      }
    });
  }
  
  

  logValidationErrors(group: FormGroup = this.recruitmentForm): void {
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

  onSubmitHr(): void {
    if (this.recruitmentForm.valid) {
      let formData = this.recruitmentForm.value;  
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
        title: "Submit your application?",
        text: "Are you sure of the details you provided? You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I am sure!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post(environment.jobcandidateUrl, formData)
            .subscribe({
              next: (response) => {
                console.log('Job candidate submitted:', response);
                this.recruitmentForm.reset();
                this.setDefaultDropdownValues();
                
                Swal.fire({
                  title: "Submitted!",
                  text: "Your application was successfully submitted!",
                  icon: "success"
                });
              },
              error: (error) => {
                console.error('Error creating candidate:', error);
                Swal.fire({
                  title: "Submission Failed",
                  text: "There was an error submitting your application. Please try again.",
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

  // Method to get display for role level, job location, and shift sched
  getRoleLevelDisplay(level: RoleLevel): string {
    return RoleLevelDisplay[level];
  }

  getJobLocationDisplay(location: JobLocation): string {
    return JobLocationDisplay[location];
  }

  getShiftSchedDisplay(sched: ShiftSchedule): string {
    return ShiftScheduleDisplay[sched];
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


  setDefaultDropdownValues(): void {
    this.recruitmentForm.patchValue({
      salaryNegotiable: '',
      noticeDuration: ''
    });
  }
}