import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixSingleTreeComponent } from './fix-single-tree.component';

describe('FixSingleTreeComponent', () => {
  let component: FixSingleTreeComponent;
  let fixture: ComponentFixture<FixSingleTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixSingleTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixSingleTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
