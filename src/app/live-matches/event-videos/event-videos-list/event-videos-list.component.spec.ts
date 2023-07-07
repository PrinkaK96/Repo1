import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventVideosListComponent } from './event-videos-list.component';

describe('EventVideosListComponent', () => {
  let component: EventVideosListComponent;
  let fixture: ComponentFixture<EventVideosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventVideosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventVideosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
