import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobCandidateCreationComponent } from './admin-job-candidate-creation.component';

describe('AdminJobCandidateCreationComponent', () => {
  let component: AdminJobCandidateCreationComponent;
  let fixture: ComponentFixture<AdminJobCandidateCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminJobCandidateCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobCandidateCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
