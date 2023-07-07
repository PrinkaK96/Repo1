import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrpPlayOffConsolidationComponent } from './grp-play-off-consolidation.component';

describe('GrpPlayOffConsolidationComponent', () => {
  let component: GrpPlayOffConsolidationComponent;
  let fixture: ComponentFixture<GrpPlayOffConsolidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrpPlayOffConsolidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrpPlayOffConsolidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
