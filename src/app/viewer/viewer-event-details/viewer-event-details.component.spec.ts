import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerEventDetailsComponent } from './viewer-event-details.component';

describe('ViewerEventDetailsComponent', () => {
  let component: ViewerEventDetailsComponent;
  let fixture: ComponentFixture<ViewerEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerEventDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
