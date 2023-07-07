import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOngoingComponent } from './all-ongoing.component';

describe('AllOngoingComponent', () => {
  let component: AllOngoingComponent;
  let fixture: ComponentFixture<AllOngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllOngoingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
