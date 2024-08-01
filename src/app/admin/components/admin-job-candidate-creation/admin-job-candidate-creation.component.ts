// import { Component, signal } from '@angular/core';
// import { ChangeDetectionStrategy } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-admin-job-candidate-creation',
//   templateUrl: './admin-job-candidate-creation.component.html',
//   styleUrl: './admin-job-candidate-creation.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class AdminJobCandidateCreationComponent {
//   readonly panelOpenState = signal(false);

//   hide = signal(true);
//   clickEvent(event: MouseEvent) {
//     this.hide.set(!this.hide);
//     event.stopPropagation();
//   }

//   firstFormGroup = this._formBuilder.group({
//     firstCtrl: ['', Validators.required],
//   });
//   secondFormGroup = this._formBuilder.group({
//     secondCtrl: ['', Validators.required],
//   });
//   thirdFormGroup = this._formBuilder.group({
//     thirdCtrl: ['', Validators.required],
//   });
//   fourthFormGroup = this._formBuilder.group({
//     fourthCtrl: ['', Validators.required],
//   });

//   isLinear = false;

//   constructor(private _formBuilder: FormBuilder) { }

// }

import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      askingSalary: ['', Validators.required],
      salaryNegotiable: ['', Validators.required],
      minSalary: ['', Validators.required],
      maxSalary: ['', Validators.required],
      noticeDuration: ['', Validators.required],
      dateApplied: ['', Validators.required],
      initialInterviewSchedule: ['', Validators.required],
      technicalInterviewSchedule: ['', Validators.required],
      clientFinalInterviewSchedule: ['', Validators.required],
      backgroundVerification: ['', Validators.required],
      applicationStatus: ['', Validators.required],
      finalSalary: ['', Validators.required],
      allowance: ['', Validators.required],
      honorarium: ['', Validators.required],
      jobOffer: ['', Validators.required],
      candidateContract: ['', Validators.required],
      remarks: ['', Validators.required]
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
}