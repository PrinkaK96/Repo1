import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeCategoryComponent } from './merge-category.component';

describe('MergeCategoryComponent', () => {
  let component: MergeCategoryComponent;
  let fixture: ComponentFixture<MergeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
