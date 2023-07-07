import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLiveMatchesComponent } from './all-live-matches.component';

describe('AllLiveMatchesComponent', () => {
  let component: AllLiveMatchesComponent;
  let fixture: ComponentFixture<AllLiveMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLiveMatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLiveMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
