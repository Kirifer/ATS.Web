import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { signal } from '@angular/core';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrl: './recruitment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruitmentComponent {
  readonly panelOpenState = signal(false);

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });

  isLinear = false;

  constructor(private _formBuilder: FormBuilder) { }

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files?.length) {
      const file: File = inputElement.files[0];
      console.log('Selected file:', file);
      // You can process the selected file here (e.g., upload to server, etc.)
    }
  }

}