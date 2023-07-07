import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventVideosComponent } from './event-videos.component';

describe('EventVideosComponent', () => {
  let component: EventVideosComponent;
  let fixture: ComponentFixture<EventVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
