import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicApplicantStatusComponent } from './public-applicant-status.component';

describe('PublicApplicantStatusComponent', () => {
  let component: PublicApplicantStatusComponent;
  let fixture: ComponentFixture<PublicApplicantStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicApplicantStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicApplicantStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
