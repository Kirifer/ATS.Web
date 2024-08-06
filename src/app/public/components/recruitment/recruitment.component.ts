// import { Component } from '@angular/core';
// import { ChangeDetectionStrategy } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';

// import { signal } from '@angular/core';

// @Component({
//   selector: 'app-recruitment',
//   templateUrl: './recruitment.component.html',
//   styleUrl: './recruitment.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class RecruitmentComponent {
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

//   onChange(event: Event) {
//     const inputElement = event.target as HTMLInputElement;
//     if (inputElement.files?.length) {
//       const file: File = inputElement.files[0];
//       console.log('Selected file:', file);
//       // You can process the selected file here (e.g., upload to server, etc.)
//     }
//   }

// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css']
})
export class RecruitmentComponent implements OnInit {
  jobcandidates: JobCandidate[] = [];
  recruitmentForm: FormGroup;

  constructor(public fb: FormBuilder, private http: HttpClient) {
    this.recruitmentForm = this.fb.group({
      csequenceNo: [{ value: '', disabled: true }, Validators.required],
      candidateName: ['', Validators.required],
      candidateEmail: ['', Validators.required],
      candidateContact: ['', Validators.required],
      askingSalary: ['', Validators.required],
      salaryNegotiable: ['', Validators.required],
      minSalary: ['', Validators.required],
      noticeDuration: ['', Validators.required],
      initialInterviewSchedule: ['', Validators.required],
      candidateCv: ['', Validators.required],
    });
  }

  ngOnInit() {}

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
      this.http.post('https://localhost:7012/jobcandidate', this.recruitmentForm.value)
        .subscribe({
          next: (response) => {
            console.log('Job candidate submitted:', response);
            this.recruitmentForm.reset();
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
    this.recruitmentForm.patchValue({
      salaryNegotiable: '',
      noticeDuration: ''
    });
  }
}