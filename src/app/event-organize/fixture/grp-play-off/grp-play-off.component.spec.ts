import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrpPlayOffComponent } from './grp-play-off.component';

describe('GrpPlayOffComponent', () => {
  let component: GrpPlayOffComponent;
  let fixture: ComponentFixture<GrpPlayOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrpPlayOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrpPlayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
