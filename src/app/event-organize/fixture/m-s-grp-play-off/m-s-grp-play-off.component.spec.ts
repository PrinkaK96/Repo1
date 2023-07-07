import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSGrpPlayOffComponent } from './m-s-grp-play-off.component';

describe('MSGrpPlayOffComponent', () => {
  let component: MSGrpPlayOffComponent;
  let fixture: ComponentFixture<MSGrpPlayOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MSGrpPlayOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MSGrpPlayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
