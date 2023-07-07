import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshboardMixDoublesComponent } from './dshboard-mix-doubles.component';

describe('DshboardMixDoublesComponent', () => {
  let component: DshboardMixDoublesComponent;
  let fixture: ComponentFixture<DshboardMixDoublesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DshboardMixDoublesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshboardMixDoublesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
