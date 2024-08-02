import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { JobRoles } from '../../../models/job-roles';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-admin-job-role-editing',
  templateUrl: './admin-job-role-editing.component.html',
  styleUrls: ['./admin-job-role-editing.component.css']
})
export class AdminJobRoleEditingComponent implements OnChanges {
  @Input() jobRole: JobRoles | null = null;
  @Output() close = new EventEmitter<void>();

  jobForm: FormGroup;

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
      openDate:[''],
      daysCovered: [''],
      aging:['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobRole'] && this.jobRole) {
      this.jobForm.patchValue(this.jobRole);
    }
  }

  onUpdate() {
    if (this.jobForm.valid && this.jobRole) {
      this.http.put(`https://localhost:7012/jobrole/${this.jobRole.id}`, this.jobForm.value).pipe(
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

  onClose() {
    this.close.emit();
  }
}
