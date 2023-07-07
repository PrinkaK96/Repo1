import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMatchesListComponent } from './live-matches-list.component';

describe('LiveMatchesListComponent', () => {
  let component: LiveMatchesListComponent;
  let fixture: ComponentFixture<LiveMatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveMatchesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveMatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
