import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSchedulerComponent } from './match-scheduler.component';

describe('MatchSchedulerComponent', () => {
  let component: MatchSchedulerComponent;
  let fixture: ComponentFixture<MatchSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchSchedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
