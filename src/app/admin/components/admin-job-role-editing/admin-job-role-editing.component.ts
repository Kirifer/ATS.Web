import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { JobRoles } from '../../../models/job-roles';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { HiringType, HiringTypeDisplay, RoleLevel, RoleLevelDisplay, JobLocation, JobLocationDisplay, ShiftSchedule, ShiftScheduleDisplay, HiringManager, HiringManagerDisplay, JobStatus, JobStatusDisplay } from '../../../models/job-roles';

@Component({
  selector: 'app-admin-job-role-editing',
  templateUrl: './admin-job-role-editing.component.html',
  styleUrls: ['./admin-job-role-editing.component.css']
})
export class AdminJobRoleEditingComponent implements OnChanges {
  @Input() jobRole: JobRoles | null = null;
  @Output() close = new EventEmitter<void>();

  jobForm: FormGroup;

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.jobForm = this.fb.group({
      jobName: [''],
      clientShortcodes: [''],
      minSalary: [0],
      maxSalary: [0],
      hiringType: [''],
      roleLevel: [''],
      jobLocation: [''],
      shiftSched: [''],
      jobDescription: [''],
      salesManager: [''],
      hiringManager: [''],
      jobStatus: [''],
      closedDate: [''],
      openDate: [''],
      daysCovered: [''],
      aging: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobRole'] && this.jobRole) {
      this.jobForm.patchValue(this.jobRole);
      console.log('Job Role:', this.jobRole);
      console.log('Candidates:', this.jobRole.candidates);
    }
  }

  onUpdate() {
    if (this.jobForm.valid && this.jobRole) {
      // Get the form value
      const formData = { ...this.jobForm.value };

      // Check if closedDate is an empty string and set it to null
      if (!formData.closedDate) {
        formData.closedDate = null;
      }

      this.http.put(`${environment.jobroleUrl}/${this.jobRole.id}`, formData).pipe(
        tap(response => {
          console.log('Job updated:', response);
          this.onClose();
        }),
        catchError(error => {
          console.error('Error updating job:', error);
          return throwError(() => new Error('Error updating job'));
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
