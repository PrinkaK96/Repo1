import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerRankingsComponent } from './viewer-rankings.component';

describe('ViewerRankingsComponent', () => {
  let component: ViewerRankingsComponent;
  let fixture: ComponentFixture<ViewerRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerRankingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
