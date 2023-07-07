import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshboardDoublesComponent } from './dshboard-doubles.component';

describe('DshboardDoublesComponent', () => {
  let component: DshboardDoublesComponent;
  let fixture: ComponentFixture<DshboardDoublesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DshboardDoublesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshboardDoublesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
