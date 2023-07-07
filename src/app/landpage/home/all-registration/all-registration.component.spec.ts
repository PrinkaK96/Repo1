import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRegistrationComponent } from './all-registration.component';

describe('AllRegistrationComponent', () => {
  let component: AllRegistrationComponent;
  let fixture: ComponentFixture<AllRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
