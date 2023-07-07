import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentVideosViewComponent } from './recent-videos-view.component';

describe('RecentVideosViewComponent', () => {
  let component: RecentVideosViewComponent;
  let fixture: ComponentFixture<RecentVideosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentVideosViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentVideosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
