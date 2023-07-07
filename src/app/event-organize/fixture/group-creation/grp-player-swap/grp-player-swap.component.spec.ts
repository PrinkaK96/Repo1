import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrpPlayerSwapComponent } from './grp-player-swap.component';

describe('GrpPlayerSwapComponent', () => {
  let component: GrpPlayerSwapComponent;
  let fixture: ComponentFixture<GrpPlayerSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrpPlayerSwapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrpPlayerSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
