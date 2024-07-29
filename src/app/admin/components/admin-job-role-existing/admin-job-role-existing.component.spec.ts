import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobRoleExistingComponent } from './admin-job-role-existing.component';

describe('AdminJobRoleExistingComponent', () => {
  let component: AdminJobRoleExistingComponent;
  let fixture: ComponentFixture<AdminJobRoleExistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminJobRoleExistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobRoleExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
