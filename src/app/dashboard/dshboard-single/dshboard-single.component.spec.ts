import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshboardSingleComponent } from './dshboard-single.component';

describe('DshboardSingleComponent', () => {
  let component: DshboardSingleComponent;
  let fixture: ComponentFixture<DshboardSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DshboardSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshboardSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
