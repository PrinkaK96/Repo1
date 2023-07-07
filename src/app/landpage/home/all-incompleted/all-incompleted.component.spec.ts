import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncompletedComponent } from './all-incompleted.component';

describe('AllIncompletedComponent', () => {
  let component: AllIncompletedComponent;
  let fixture: ComponentFixture<AllIncompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllIncompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIncompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
