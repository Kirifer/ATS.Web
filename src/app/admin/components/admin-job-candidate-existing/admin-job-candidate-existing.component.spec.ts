import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobCandidateExistingComponent } from './admin-job-candidate-existing.component';

describe('AdminJobCandidateExistingComponent', () => {
  let component: AdminJobCandidateExistingComponent;
  let fixture: ComponentFixture<AdminJobCandidateExistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminJobCandidateExistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobCandidateExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
