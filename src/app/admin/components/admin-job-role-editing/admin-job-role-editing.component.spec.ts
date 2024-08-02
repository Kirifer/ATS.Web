import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobRoleEditingComponent } from './admin-job-role-editing.component';

describe('AdminJobRoleEditingComponent', () => {
  let component: AdminJobRoleEditingComponent;
  let fixture: ComponentFixture<AdminJobRoleEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminJobRoleEditingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobRoleEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
