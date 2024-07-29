import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobRolePostingComponent } from './admin-job-role-posting.component';

describe('AdminJobRolePostingComponent', () => {
  let component: AdminJobRolePostingComponent;
  let fixture: ComponentFixture<AdminJobRolePostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminJobRolePostingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobRolePostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
