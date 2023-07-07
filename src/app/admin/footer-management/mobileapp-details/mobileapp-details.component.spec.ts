import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileappDetailsComponent } from './mobileapp-details.component';

describe('MobileappDetailsComponent', () => {
  let component: MobileappDetailsComponent;
  let fixture: ComponentFixture<MobileappDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileappDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileappDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
