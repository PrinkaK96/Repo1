import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegMixDoublesComponent } from './reg-mix-doubles.component';

describe('RegMixDoublesComponent', () => {
  let component: RegMixDoublesComponent;
  let fixture: ComponentFixture<RegMixDoublesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegMixDoublesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegMixDoublesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
