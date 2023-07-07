import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixDoubleTreeComponent } from './fix-double-tree.component';

describe('FixDoubleTreeComponent', () => {
  let component: FixDoubleTreeComponent;
  let fixture: ComponentFixture<FixDoubleTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixDoubleTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixDoubleTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
