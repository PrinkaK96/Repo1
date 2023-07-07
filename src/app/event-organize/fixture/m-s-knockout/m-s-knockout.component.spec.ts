import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSKnockoutComponent } from './m-s-knockout.component';

describe('MSKnockoutComponent', () => {
  let component: MSKnockoutComponent;
  let fixture: ComponentFixture<MSKnockoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MSKnockoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MSKnockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
