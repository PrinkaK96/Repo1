import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentVideosListComponent } from './recent-videos-list.component';

describe('RecentVideosListComponent', () => {
  let component: RecentVideosListComponent;
  let fixture: ComponentFixture<RecentVideosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentVideosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentVideosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
