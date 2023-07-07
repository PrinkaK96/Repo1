import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDoublesComponent } from './create-doubles.component';

describe('CreateDoublesComponent', () => {
  let component: CreateDoublesComponent;
  let fixture: ComponentFixture<CreateDoublesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDoublesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDoublesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
