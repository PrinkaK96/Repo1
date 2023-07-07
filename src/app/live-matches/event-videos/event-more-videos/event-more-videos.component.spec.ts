import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMoreVideosComponent } from './event-more-videos.component';

describe('EventMoreVideosComponent', () => {
  let component: EventMoreVideosComponent;
  let fixture: ComponentFixture<EventMoreVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMoreVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMoreVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
