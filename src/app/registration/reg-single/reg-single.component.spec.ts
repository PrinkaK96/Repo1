import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSingleComponent } from './reg-single.component';

describe('RegSingleComponent', () => {
  let component: RegSingleComponent;
  let fixture: ComponentFixture<RegSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
