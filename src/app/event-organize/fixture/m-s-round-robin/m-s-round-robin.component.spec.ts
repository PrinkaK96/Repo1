import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSRoundRobinComponent } from './m-s-round-robin.component';

describe('MSRoundRobinComponent', () => {
  let component: MSRoundRobinComponent;
  let fixture: ComponentFixture<MSRoundRobinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MSRoundRobinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MSRoundRobinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
