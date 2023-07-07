import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMatchViewComponent } from './live-match-view.component';

describe('LiveMatchViewComponent', () => {
  let component: LiveMatchViewComponent;
  let fixture: ComponentFixture<LiveMatchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveMatchViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveMatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
