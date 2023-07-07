import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WttStarMatchesListComponent } from './wtt-star-matches-list.component';

describe('WttStarMatchesListComponent', () => {
  let component: WttStarMatchesListComponent;
  let fixture: ComponentFixture<WttStarMatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WttStarMatchesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WttStarMatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
