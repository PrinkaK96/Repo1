import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventVideosViewComponent } from './event-videos-view.component';

describe('EventVideosViewComponent', () => {
  let component: EventVideosViewComponent;
  let fixture: ComponentFixture<EventVideosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventVideosViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventVideosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
