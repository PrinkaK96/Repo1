import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentRemovedComponent } from './recent-removed.component';

describe('RecentRemovedComponent', () => {
  let component: RecentRemovedComponent;
  let fixture: ComponentFixture<RecentRemovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentRemovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
