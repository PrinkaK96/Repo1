import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GRankLayoutComponent } from './g-rank-layout.component';

describe('GRankLayoutComponent', () => {
  let component: GRankLayoutComponent;
  let fixture: ComponentFixture<GRankLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GRankLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GRankLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
