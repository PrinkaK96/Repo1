import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegDoublesComponent } from './reg-doubles.component';

describe('RegDoublesComponent', () => {
  let component: RegDoublesComponent;
  let fixture: ComponentFixture<RegDoublesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegDoublesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegDoublesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
