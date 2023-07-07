import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerRegistrationComponent } from './viewer-registration.component';

describe('ViewerRegistrationComponent', () => {
  let component: ViewerRegistrationComponent;
  let fixture: ComponentFixture<ViewerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
