import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCredentialsComponent } from './update-credentials.component';

describe('UpdateCredentialsComponent', () => {
  let component: UpdateCredentialsComponent;
  let fixture: ComponentFixture<UpdateCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCredentialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
