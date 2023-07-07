import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRegistrationComponent } from './open-registration.component';

describe('OpenRegistrationComponent', () => {
  let component: OpenRegistrationComponent;
  let fixture: ComponentFixture<OpenRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
