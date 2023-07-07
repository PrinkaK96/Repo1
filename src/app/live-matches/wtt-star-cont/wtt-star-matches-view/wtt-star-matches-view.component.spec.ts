import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WttStarMatchesViewComponent } from './wtt-star-matches-view.component';

describe('WttStarMatchesViewComponent', () => {
  let component: WttStarMatchesViewComponent;
  let fixture: ComponentFixture<WttStarMatchesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WttStarMatchesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WttStarMatchesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
