import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerGrpPlayOffComponent } from './viewer-grp-play-off.component';

describe('ViewerGrpPlayOffComponent', () => {
  let component: ViewerGrpPlayOffComponent;
  let fixture: ComponentFixture<ViewerGrpPlayOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerGrpPlayOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerGrpPlayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
