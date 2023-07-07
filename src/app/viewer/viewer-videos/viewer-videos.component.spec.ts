import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerVideosComponent } from './viewer-videos.component';

describe('ViewerVideosComponent', () => {
  let component: ViewerVideosComponent;
  let fixture: ComponentFixture<ViewerVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
