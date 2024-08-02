import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobCandidateEditingComponent } from './admin-job-candidate-editing.component';

describe('AdminJobCandidateEditingComponent', () => {
  let component: AdminJobCandidateEditingComponent;
  let fixture: ComponentFixture<AdminJobCandidateEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminJobCandidateEditingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobCandidateEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
