import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupManagementComponent } from './signup-management.component';

describe('SignupManagementComponent', () => {
  let component: SignupManagementComponent;
  let fixture: ComponentFixture<SignupManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
